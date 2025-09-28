#!/usr/bin/env python3
"""
WebSocket Server for Divorce Support Platform
Handles real-time communication between frontend and ASI:One Chat Protocol
"""

import asyncio
import json
import websockets
from websockets import WebSocketServerProtocol
from typing import Dict, List, Set
import logging
import uuid
from datetime import datetime, timedelta
import sys
import pathlib

# Add parent directory to path for imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class DivorceSupportWebSocketServer:
    def __init__(self, host='localhost', port=3001):
        self.host = host
        self.port = port
        self.connected_clients: Dict[str, WebSocketServerProtocol] = {}
        self.user_sessions: Dict[str, Dict] = {}
        self.room_users: Dict[str, Set[str]] = {}
        self.message_history: Dict[str, List[Dict]] = {}
        self.response_cache: Dict[str, Dict] = {}

    async def start_server(self):
        """Start the WebSocket server"""
        logger.info(f"🚀 Starting Divorce Support WebSocket server on {self.host}:{self.port}")

        async with websockets.serve(
            self.handle_connection,
            self.host,
            self.port,
            ping_interval=20,
            ping_timeout=10
        ):
            await asyncio.Future()  # Run forever

    async def handle_connection(self, websocket: WebSocketServerProtocol, path: str):
        """Handle new WebSocket connections"""

        # Generate session ID
        session_id = str(uuid.uuid4())
        anonymous_id = f"anon_{session_id[:8]}"

        # Store connection
        self.connected_clients[session_id] = websocket
        self.user_sessions[session_id] = {
            "session_id": session_id,
            "anonymous_id": anonymous_id,
            "connected_at": datetime.now().isoformat(),
            "last_activity": datetime.now().isoformat(),
            "current_room": None,
            "status": "connected"
        }

        logger.info(f"🔗 New connection established: {anonymous_id} (Session: {session_id})")

        try:
            # Send welcome message
            await self.send_message(websocket, {
                "type": "session_initialized",
                "session_id": session_id,
                "anonymous_id": anonymous_id,
                "message": {
                    "content": "Welcome to the Anonymous Divorce Support Platform. This is a safe, private space where you can share your feelings and receive AI-powered emotional support.",
                    "timestamp": datetime.now().isoformat()
                }
            })

            # Handle incoming messages
            async for message in websocket:
                try:
                    data = json.loads(message)
                    await self.handle_message(session_id, data)
                except json.JSONDecodeError:
                    logger.error(f"Invalid JSON received from session {session_id}")
                except Exception as e:
                    logger.error(f"Error handling message from session {session_id}: {e}")

        except websockets.exceptions.ConnectionClosed:
            logger.info(f"🔌 Connection closed: {anonymous_id}")
        finally:
            # Clean up on disconnect
            await self.handle_disconnect(session_id)

    async def handle_message(self, session_id: str, data: Dict):
        """Handle incoming messages from clients"""

        message_type = data.get("type")
        session = self.user_sessions.get(session_id)

        if not session:
            logger.error(f"Session not found: {session_id}")
            return

        # Update last activity
        session["last_activity"] = datetime.now().isoformat()
        self.user_sessions[session_id] = session

        if message_type == "join_room":
            await self.handle_join_room(session_id, data)
        elif message_type == "user_message":
            await self.handle_user_message(session_id, data)
        elif message_type == "leave_room":
            await self.handle_leave_room(session_id, data)
        elif message_type == "ping":
            await self.send_message(self.connected_clients[session_id], {"type": "pong"})
        else:
            logger.warning(f"Unknown message type: {message_type}")

    async def handle_join_room(self, session_id: str, data: Dict):
        """Handle user joining a room"""

        room_id = data.get("room_id")
        session = self.user_sessions[session_id]

        # Leave current room if any
        if session["current_room"]:
            await self.handle_leave_room(session_id, {"room_id": session["current_room"]})

        # Join new room
        session["current_room"] = room_id
        self.user_sessions[session_id] = session

        # Add user to room
        if room_id not in self.room_users:
            self.room_users[room_id] = set()
        self.room_users[room_id].add(session_id)

        # Initialize message history for room
        if room_id not in self.message_history:
            self.message_history[room_id] = []

        # Send room join confirmation
        await self.send_message(self.connected_clients[session_id], {
            "type": "room_joined",
            "room_id": room_id,
            "message": {
                "content": f"Welcome to {room_id.replace('_', ' ').title()}! This is a safe space for support.",
                "timestamp": datetime.now().isoformat()
            }
        })

        # Send room information
        room_info = await self.get_room_info(room_id)
        await self.send_message(self.connected_clients[session_id], {
            "type": "room_info",
            "room": room_info
        })

        logger.info(f"🏠 User {session['anonymous_id']} joined room: {room_id}")

    async def handle_user_message(self, session_id: str, data: Dict):
        """Handle user messages and coordinate with agent system"""

        message_content = data.get("message", "")
        room_id = data.get("room_id")
        session = self.user_sessions[session_id]

        if not message_content.strip():
            return

        # Create message object
        message_obj = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "anonymous_id": session["anonymous_id"],
            "content": message_content,
            "room_id": room_id,
            "timestamp": datetime.now().isoformat(),
            "sender": "user"
        }

        # Store message in room history
        if room_id:
            self.message_history[room_id].append(message_obj)

            # Keep only last 100 messages per room
            if len(self.message_history[room_id]) > 100:
                self.message_history[room_id] = self.message_history[room_id][-100:]

        # Send user message to all users in the room (for multi-user rooms)
        await self.broadcast_to_room(room_id, {
            "type": "user_message",
            "message": message_obj
        }, exclude_session=session_id)

        # Process message with agent system
        await self.process_with_agents(session_id, message_obj)

        logger.info(f"💬 User message processed: {session['anonymous_id']} in room {room_id}")

    async def handle_leave_room(self, session_id: str, data: Dict):
        """Handle user leaving a room"""

        room_id = data.get("room_id")
        session = self.user_sessions[session_id]

        if room_id and room_id in self.room_users:
            self.room_users[room_id].discard(session_id)

            # Clean up empty rooms
            if not self.room_users[room_id]:
                del self.room_users[room_id]
                if room_id in self.message_history:
                    del self.message_history[room_id]

        session["current_room"] = None
        self.user_sessions[session_id] = session

        await self.send_message(self.connected_clients[session_id], {
            "type": "room_left",
            "room_id": room_id,
            "message": {
                "content": f"You have left {room_id.replace('_', ' ').title()}.",
                "timestamp": datetime.now().isoformat()
            }
        })

        logger.info(f"🏠 User {session['anonymous_id']} left room: {room_id}")

    async def process_with_agents(self, session_id: str, message_obj: Dict):
        """Process user message with the agent system"""

        session = self.user_sessions[session_id]

        # Create support request for agents
        support_request = {
            "user_id": session["anonymous_id"],
            "message": message_obj["content"],
            "room_type": message_obj["room_id"] or "general",
            "session_id": session_id,
            "timestamp": message_obj["timestamp"],
            "anonymous_id": session["anonymous_id"]
        }

        # Send to orchestrator agent (in real implementation)
        # For now, simulate agent processing
        await self.simulate_agent_processing(session_id, support_request)

    async def simulate_agent_processing(self, session_id: str, support_request: Dict):
        """Simulate agent processing (replace with actual agent calls)"""

        # Simulate processing delay
        await asyncio.sleep(1)

        # Generate mock agent response
        mock_response = {
            "user_id": support_request["user_id"],
            "session_id": support_request["session_id"],
            "response": "Thank you for sharing that with me. I understand this is a difficult time for you. How are you feeling about what you're going through?",
            "room_suggestions": ["emotional-support", "general-support"],
            "resources": [
                {
                    "type": "article",
                    "title": "Coping with Divorce Emotions",
                    "url": "https://www.helpguide.org/articles/grief/coping-with-divorce.htm"
                }
            ],
            "crisis_alert": False,
            "human_intervention": False,
            "follow_up_questions": [
                "What specific emotions are you experiencing right now?",
                "How has this situation been affecting your daily life?"
            ],
            "timestamp": datetime.now().isoformat()
        }

        # Send agent response to user
        await self.send_agent_response(session_id, mock_response)

    async def send_agent_response(self, session_id: str, response: Dict):
        """Send agent response to user"""

        websocket = self.connected_clients.get(session_id)
        if not websocket:
            logger.error(f"No websocket found for session {session_id}")
            return

        # Create AI message object
        ai_message = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "content": response["response"],
            "room_id": self.user_sessions[session_id]["current_room"],
            "timestamp": response["timestamp"],
            "sender": "ai",
            "resources": response.get("resources", []),
            "room_suggestions": response.get("room_suggestions", []),
            "crisis_alert": response.get("crisis_alert", False),
            "follow_up_questions": response.get("follow_up_questions", [])
        }

        # Store AI message in room history
        room_id = self.user_sessions[session_id]["current_room"]
        if room_id:
            self.message_history[room_id].append(ai_message)

        # Send to user
        await self.send_message(websocket, {
            "type": "ai_message",
            "message": ai_message
        })

        # Handle crisis alerts
        if response.get("crisis_alert"):
            await self.handle_crisis_alert(session_id, response)

        logger.info(f"🤖 AI response sent to session {session_id}")

    async def handle_crisis_alert(self, session_id: str, response: Dict):
        """Handle crisis alert situations"""

        session = self.user_sessions[session_id]

        # Create crisis response
        crisis_message = {
            "id": str(uuid.uuid4()),
            "session_id": session_id,
            "content": "I'm very concerned about you right now. Please know that you're not alone and there are people who want to help.",
            "room_id": session["current_room"],
            "timestamp": datetime.now().isoformat(),
            "sender": "system",
            "crisis_alert": True,
            "emergency_resources": [
                {
                    "name": "National Suicide Prevention Lifeline",
                    "contact": "988",
                    "available": "24/7"
                },
                {
                    "name": "Crisis Text Line",
                    "contact": "Text HOME to 741741",
                    "available": "24/7"
                }
            ]
        }

        # Store crisis message
        room_id = session["current_room"]
        if room_id:
            self.message_history[room_id].append(crisis_message)

        # Send crisis response
        websocket = self.connected_clients.get(session_id)
        if websocket:
            await self.send_message(websocket, {
                "type": "crisis_alert",
                "message": crisis_message
            })

        # Move user to crisis intervention room
        if session["current_room"] != "crisis-intervention":
            await self.move_user_to_room(session_id, "crisis-intervention")

        logger.warning(f"🚨 Crisis alert handled for session {session_id}")

    async def move_user_to_room(self, session_id: str, new_room_id: str):
        """Move user to a different room"""

        session = self.user_sessions[session_id]
        old_room = session["current_room"]

        # Leave old room
        if old_room and old_room in self.room_users:
            self.room_users[old_room].discard(session_id)

        # Join new room
        session["current_room"] = new_room_id
        if new_room_id not in self.room_users:
            self.room_users[new_room_id] = set()
        self.room_users[new_room_id].add(session_id)

        # Send room transfer notification
        websocket = self.connected_clients.get(session_id)
        if websocket:
            await self.send_message(websocket, {
                "type": "room_transfer",
                "old_room": old_room,
                "new_room": new_room_id,
                "message": {
                    "content": f"You've been moved to {new_room_id.replace('_', ' ').title()} for specialized support.",
                    "timestamp": datetime.now().isoformat()
                }
            })

        logger.info(f"🏠 User moved from {old_room} to {new_room_id}")

    async def broadcast_to_room(self, room_id: str, message: Dict, exclude_session: str = None):
        """Broadcast message to all users in a room"""

        if room_id not in self.room_users:
            return

        for session_id in self.room_users[room_id]:
            if session_id != exclude_session:
                websocket = self.connected_clients.get(session_id)
                if websocket:
                    await self.send_message(websocket, message)

    async def send_message(self, websocket: WebSocketServerProtocol, message: Dict):
        """Send message to websocket client"""

        try:
            await websocket.send(json.dumps(message))
        except Exception as e:
            logger.error(f"Error sending message: {e}")

    async def get_room_info(self, room_id: str) -> Dict:
        """Get information about a room"""

        room_info = {
            "id": room_id,
            "name": room_id.replace("_", " ").title(),
            "description": f"Support room for {room_id.replace('_", " ")}",
            "user_count": len(self.room_users.get(room_id, [])),
            "max_users": 50,  # Default max users
            "category": "general"
        }

        # Room-specific configurations
        room_configs = {
            "crisis-intervention": {
                "name": "Crisis Intervention",
                "description": "24/7 emergency emotional support with human counselors",
                "max_users": 10,
                "category": "crisis"
            },
            "general-support": {
                "name": "General Support",
                "description": "Open space for relationship discussions and general support",
                "max_users": 50,
                "category": "general"
            },
            "emotional-support": {
                "name": "Emotional Support",
                "description": "Focused emotional support and coping strategies",
                "max_users": 40,
                "category": "emotional"
            },
            "legal-consultation": {
                "name": "Legal Consultation",
                "description": "Anonymous legal advice and consultation",
                "max_users": 20,
                "category": "legal"
            }
        }

        if room_id in room_configs:
            config = room_configs[room_id]
            room_info.update(config)
            room_info["user_count"] = len(self.room_users.get(room_id, []))

        return room_info

    async def handle_disconnect(self, session_id: str):
        """Handle client disconnection"""

        session = self.user_sessions.get(session_id)
        if not session:
            return

        anonymous_id = session["anonymous_id"]
        current_room = session["current_room"]

        # Remove from room
        if current_room and current_room in self.room_users:
            self.room_users[current_room].discard(session_id)

            # Clean up empty rooms
            if not self.room_users[current_room]:
                del self.room_users[current_room]
                if current_room in self.message_history:
                    del self.message_history[current_room]

        # Remove session
        del self.user_sessions[session_id]
        if session_id in self.connected_clients:
            del self.connected_clients[session_id]

        logger.info(f"🔌 User disconnected: {anonymous_id}")

    async def cleanup_inactive_sessions(self):
        """Clean up inactive sessions periodically"""

        current_time = datetime.now()
        inactive_threshold = timedelta(minutes=30)

        to_remove = []
        for session_id, session in self.user_sessions.items():
            last_activity = datetime.fromisoformat(session["last_activity"])
            if current_time - last_activity > inactive_threshold:
                to_remove.append(session_id)

        for session_id in to_remove:
            await self.handle_disconnect(session_id)
            logger.info(f"🧹 Cleaned up inactive session: {session_id}")

        if to_remove:
            logger.info(f"🧹 Cleaned up {len(to_remove)} inactive sessions")

    async def get_system_stats(self) -> Dict:
        """Get system statistics"""

        total_sessions = len(self.user_sessions)
        total_rooms = len(self.room_users)
        total_messages = sum(len(messages) for messages in self.message_history.values())

        return {
            "connected_clients": len(self.connected_clients),
            "active_sessions": total_sessions,
            "active_rooms": total_rooms,
            "total_messages": total_messages,
            "rooms": {
                room_id: {
                    "user_count": len(users),
                    "message_count": len(self.message_history.get(room_id, []))
                }
                for room_id, users in self.room_users.items()
            },
            "timestamp": datetime.now().isoformat()
        }

# Global server instance
websocket_server = DivorceSupportWebSocketServer()

async def main():
    """Main function to run the WebSocket server"""

    # Start cleanup task
    asyncio.create_task(periodic_cleanup())

    # Start the server
    await websocket_server.start_server()

async def periodic_cleanup():
    """Periodic cleanup of inactive sessions"""

    while True:
        await asyncio.sleep(300)  # Run every 5 minutes
        await websocket_server.cleanup_inactive_sessions()

if __name__ == "__main__":
    asyncio.run(main())
