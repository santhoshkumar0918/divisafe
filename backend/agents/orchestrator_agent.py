#!/usr/bin/env python3
"""
Main Orchestrator Agent for Divorce Support Platform
Coordinates all agents and manages the overall support system with MeTTa integration
"""

import asyncio
import json
from typing import Dict, List
from dataclasses import dataclass
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
import sys
import pathlib
from datetime import datetime
import uuid

# Add parent directory to path for imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

@dataclass
class SupportRequest:
    user_id: str
    message: str
    room_type: str
    session_id: str
    timestamp: str
    anonymous_id: str

@dataclass
class OrchestratorResponse:
    user_id: str
    session_id: str
    response: str
    room_suggestions: List[str]
    resources: List[Dict]
    crisis_alert: bool
    human_intervention: bool
    follow_up_questions: List[str]

# Main Orchestrator Agent
orchestrator = Agent(
    name="divorce_support_orchestrator",
    seed="divorce_support_orchestrator_master_2024",
    port=8000,
    endpoint=["http://localhost:8000/submit"]
)

@orchestrator.on_event("startup")
async def setup_orchestrator(ctx: Context):
    """Initialize the main orchestrator agent"""
    ctx.logger.info("🎭 Divorce Support Orchestrator starting up...")

    # Initialize system statistics
    system_stats = {
        "total_requests": 0,
        "successful_responses": 0,
        "crisis_interventions": 0,
        "human_escalations": 0,
        "active_sessions": {},
        "agent_responses": {
            "emotional_analyzer": 0,
            "room_matcher": 0,
            "crisis_monitor": 0,
            "knowledge_base": 0
        }
    }

    ctx.storage.set("system_stats", system_stats)
    ctx.storage.set("response_cache", {})

    ctx.logger.info("✅ Orchestrator initialized successfully")

@orchestrator.on_message(model=SupportRequest)
async def process_support_request(ctx: Context, sender: str, msg: SupportRequest):
    """Process incoming support requests and coordinate agent responses"""

    ctx.logger.info(f"🎭 Processing support request from user: {msg.anonymous_id}")

    # Update system statistics
    system_stats = ctx.storage.get("system_stats")
    system_stats["total_requests"] += 1

    # Track active session
    active_sessions = system_stats["active_sessions"]
    active_sessions[msg.session_id] = {
        "user_id": msg.user_id,
        "anonymous_id": msg.anonymous_id,
        "room_type": msg.room_type,
        "started_at": msg.timestamp,
        "last_activity": msg.timestamp,
        "status": "processing"
    }
    system_stats["active_sessions"] = active_sessions
    ctx.storage.set("system_stats", system_stats)

    # Send request to all specialized agents
    await coordinate_agent_requests(ctx, msg)

async def coordinate_agent_requests(ctx: Context, request: SupportRequest):
    """Coordinate requests to all specialized agents"""

    # Send to Emotional Analyzer
    await ctx.send("emotional_analyzer", request)

    # Send to Room Matcher
    room_match_request = {
        "user_id": request.user_id,
        "anonymous_id": request.anonymous_id,
        "session_id": request.session_id,
        "emotional_state": "analyzing",  # Will be updated by emotional analyzer
        "crisis_level": "unknown",      # Will be updated by emotional analyzer
        "cultural_context": "",         # Will be updated by emotional analyzer
        "current_room": request.room_type,
        "timestamp": request.timestamp
    }
    await ctx.send("room_matcher", room_match_request)

    # Send to Crisis Monitor
    await ctx.send("crisis_monitor", request)

    # Send to Knowledge Base
    resource_request = {
        "user_id": request.user_id,
        "anonymous_id": request.anonymous_id,
        "session_id": request.session_id,
        "emotional_state": "analyzing",
        "crisis_level": "unknown",
        "cultural_context": "",
        "room_type": request.room_type,
        "timestamp": request.timestamp
    }
    await ctx.send("knowledge_base", resource_request)

    ctx.logger.info(f"📤 Requests sent to all agents for user {request.anonymous_id}")

# Handle responses from Emotional Analyzer
@orchestrator.on_message(model=dict)
async def handle_emotional_analysis(ctx: Context, sender: str, msg: Dict):
    """Handle responses from Emotional Analyzer agent"""

    if msg.get("primary_emotion"):  # This is an emotional analysis response
        system_stats = ctx.storage.get("system_stats")
        system_stats["agent_responses"]["emotional_analyzer"] += 1
        ctx.storage.set("system_stats", system_stats)

        # Update active session with emotional analysis
        active_sessions = system_stats["active_sessions"]
        if msg.get("session_id") in active_sessions:
            active_sessions[msg["session_id"]]["emotional_analysis"] = msg
            active_sessions[msg["session_id"]]["last_activity"] = datetime.now().isoformat()
            system_stats["active_sessions"] = active_sessions
            ctx.storage.set("system_stats", system_stats)

        # Check if crisis intervention is needed
        if msg.get("crisis_level") == "emergency" or msg.get("requires_human_intervention"):
            await handle_crisis_coordination(ctx, msg)

        ctx.logger.info(f"🧠 Emotional analysis received for session {msg.get('session_id')}")

# Handle responses from Room Matcher
@orchestrator.on_message(model=dict)
async def handle_room_recommendation(ctx: Context, sender: str, msg: Dict):
    """Handle room recommendations from Room Matcher agent"""

    if msg.get("recommended_rooms"):  # This is a room recommendation response
        system_stats = ctx.storage.get("system_stats")
        system_stats["agent_responses"]["room_matcher"] += 1
        ctx.storage.set("system_stats", system_stats)

        # Update active session with room recommendation
        active_sessions = system_stats["active_sessions"]
        if msg.get("session_id") in active_sessions:
            active_sessions[msg["session_id"]]["room_recommendation"] = msg
            active_sessions[msg["session_id"]]["last_activity"] = datetime.now().isoformat()
            system_stats["active_sessions"] = active_sessions
            ctx.storage.set("system_stats", system_stats)

        ctx.logger.info(f"🏠 Room recommendation received for session {msg.get('session_id')}")

# Handle responses from Crisis Monitor
@orchestrator.on_message(model=dict)
async def handle_crisis_response(ctx: Context, sender: str, msg: Dict):
    """Handle crisis responses from Crisis Monitor agent"""

    if msg.get("type") in ["crisis_response_sent", "emergency_intervention", "high_priority_intervention"]:
        system_stats = ctx.storage.get("system_stats")
        system_stats["agent_responses"]["crisis_monitor"] += 1

        if "crisis" in msg.get("type", ""):
            system_stats["crisis_interventions"] += 1

        ctx.storage.set("system_stats", system_stats)

        # Update active session with crisis response
        active_sessions = system_stats["active_sessions"]
        if msg.get("session_id") in active_sessions:
            active_sessions[msg["session_id"]]["crisis_response"] = msg
            active_sessions[msg["session_id"]]["last_activity"] = datetime.now().isoformat()
            system_stats["active_sessions"] = active_sessions
            ctx.storage.set("system_stats", system_stats)

        # If this is an emergency, send immediate response to user
        if msg.get("type") == "emergency_intervention":
            await send_emergency_response_to_user(ctx, msg)

        ctx.logger.info(f"🚨 Crisis response handled for session {msg.get('session_id')}")

# Handle responses from Knowledge Base
@orchestrator.on_message(model=dict)
async def handle_resource_response(ctx: Context, sender: str, msg: Dict):
    """Handle resource responses from Knowledge Base agent"""

    if msg.get("resources") or msg.get("articles"):  # This is a resource response
        system_stats = ctx.storage.get("system_stats")
        system_stats["agent_responses"]["knowledge_base"] += 1
        ctx.storage.set("system_stats", system_stats)

        # Update active session with resources
        active_sessions = system_stats["active_sessions"]
        if msg.get("session_id") in active_sessions:
            active_sessions[msg["session_id"]]["resources"] = msg
            active_sessions[msg["session_id"]]["last_activity"] = datetime.now().isoformat()
            system_stats["active_sessions"] = active_sessions
            ctx.storage.set("system_stats", system_stats)

        ctx.logger.info(f"📚 Resources received for session {msg.get('session_id')}")

# Compile and send final response to user
@orchestrator.on_interval(period=2.0)  # Check every 2 seconds for complete responses
async def compile_responses(ctx: Context):
    """Compile responses from all agents and send final response to user"""

    system_stats = ctx.storage.get("system_stats")
    active_sessions = system_stats.get("active_sessions", {})

    for session_id, session_data in list(active_sessions.items()):
        # Check if session has been active for more than 30 seconds (timeout)
        last_activity = datetime.fromisoformat(session_data["last_activity"])
        if (datetime.now() - last_activity).seconds > 30:
            # Session timed out - send fallback response
            await send_timeout_response(ctx, session_data)
            continue

        # Check if we have responses from all agents
        required_responses = ["emotional_analysis", "room_recommendation", "resources"]
        has_all_responses = all(
            key in session_data for key in required_responses
        )

        if has_all_responses and session_data.get("status") == "processing":
            # Compile final response
            final_response = await compile_final_response(ctx, session_data)

            # Mark session as completed
            session_data["status"] = "completed"
            session_data["completed_at"] = datetime.now().isoformat()
            system_stats["successful_responses"] += 1
            system_stats["active_sessions"] = active_sessions
            ctx.storage.set("system_stats", system_stats)

            # Send final response (in real implementation, this would go to WebSocket)
            await send_final_response_to_user(ctx, final_response)

            ctx.logger.info(f"✅ Final response compiled for session {session_id}")

async def compile_final_response(ctx: Context, session_data: Dict) -> Dict:
    """Compile final response from all agent responses"""

    emotional_analysis = session_data.get("emotional_analysis", {})
    room_recommendation = session_data.get("room_recommendation", {})
    resources = session_data.get("resources", {})

    # Create final response
    final_response = {
        "user_id": session_data["user_id"],
        "session_id": session_data["session_id"],
        "response": emotional_analysis.get("response", "I'm here to support you through this difficult time."),
        "room_suggestions": room_recommendation.get("recommended_rooms", ["general-support"]),
        "resources": resources.get("resources", []),
        "articles": resources.get("articles", []),
        "support_groups": resources.get("support_groups", []),
        "hotlines": resources.get("hotlines", []),
        "crisis_alert": emotional_analysis.get("crisis_level") in ["high", "emergency"],
        "human_intervention": emotional_analysis.get("requires_human_intervention", False),
        "follow_up_questions": emotional_analysis.get("follow_up_questions", []),
        "emotional_state": {
            "primary_emotion": emotional_analysis.get("primary_emotion", "neutral"),
            "intensity": emotional_analysis.get("intensity", "low"),
            "crisis_level": emotional_analysis.get("crisis_level", "low"),
            "cultural_context": emotional_analysis.get("cultural_context", "")
        },
        "timestamp": datetime.now().isoformat()
    }

    return final_response

async def handle_crisis_coordination(ctx: Context, emotional_analysis: Dict):
    """Coordinate crisis intervention across all agents"""

    ctx.logger.warning(f"🚨 Coordinating crisis intervention for session {emotional_analysis.get('session_id')}")

    # Create crisis coordination message
    crisis_coordination = {
        "type": "crisis_coordination",
        "session_id": emotional_analysis["session_id"],
        "crisis_level": emotional_analysis["crisis_level"],
        "requires_human_intervention": emotional_analysis["requires_human_intervention"],
        "immediate_response": emotional_analysis["response"],
        "coordination_timestamp": datetime.now().isoformat()
    }

    # Notify all agents about crisis situation
    await ctx.send("crisis_monitor", crisis_coordination)
    await ctx.send("room_matcher", crisis_coordination)

async def send_emergency_response_to_user(ctx: Context, crisis_response: Dict):
    """Send emergency response immediately to user"""

    emergency_message = {
        "type": "emergency_response",
        "user_id": crisis_response["user_id"],
        "session_id": crisis_response["session_id"],
        "crisis_alert": True,
        "immediate_response": crisis_response.get("immediate_actions", ["Contact emergency services immediately"]),
        "emergency_contacts": crisis_response.get("emergency_contacts", []),
        "message": "I'm very concerned about you. Please reach out to emergency services immediately. You are not alone.",
        "timestamp": datetime.now().isoformat()
    }

    # In real implementation, this would be sent via WebSocket to the user
    ctx.logger.critical(f"🚨 Emergency response sent to user in session {crisis_response.get('session_id')}")

async def send_timeout_response(ctx: Context, session_data: Dict):
    """Send timeout response when agents don't respond in time"""

    timeout_response = {
        "user_id": session_data["user_id"],
        "session_id": session_data["session_id"],
        "response": "I'm here to support you, though I'm experiencing some technical difficulties. Please try again in a moment, or contact emergency services if this is urgent.",
        "room_suggestions": ["general-support"],
        "crisis_alert": False,
        "human_intervention": False,
        "timeout": True,
        "timestamp": datetime.now().isoformat()
    }

    await send_final_response_to_user(ctx, timeout_response)

    # Mark session as timed out
    session_data["status"] = "timed_out"
    session_data["timed_out_at"] = datetime.now().isoformat()

async def send_final_response_to_user(ctx: Context, response: Dict):
    """Send final compiled response to user (placeholder for WebSocket integration)"""

    # In real implementation, this would send via WebSocket to the frontend
    ctx.logger.info(f"📤 Final response ready for user {response['user_id']}")
    ctx.logger.info(f"   Response preview: {response['response'][:100]}...")

    # Store in response cache for WebSocket server to pick up
    response_cache = ctx.storage.get("response_cache", {})
    response_cache[response["session_id"]] = response
    ctx.storage.set("response_cache", response_cache)

# Protocol for orchestrator communication
orchestrator_protocol = Protocol("Divorce Support Orchestrator Protocol")

# Add protocol to agent
orchestrator.include(orchestrator_protocol)

# Health check endpoint
@orchestrator.on_rest_get("/health")
async def health_check(ctx: Context):
    """Health check endpoint"""
    system_stats = ctx.storage.get("system_stats", {})

    return {
        "status": "healthy",
        "agent": "orchestrator",
        "total_requests": system_stats.get("total_requests", 0),
        "successful_responses": system_stats.get("successful_responses", 0),
        "crisis_interventions": system_stats.get("crisis_interventions", 0),
        "active_sessions": len(system_stats.get("active_sessions", {})),
        "agent_responses": system_stats.get("agent_responses", {})
    }

# System status endpoint
@orchestrator.on_rest_get("/status")
async def system_status(ctx: Context):
    """System status endpoint"""
    system_stats = ctx.storage.get("system_stats", {})
    active_sessions = system_stats.get("active_sessions", {})

    return {
        "system_status": "operational",
        "uptime": "since_startup",
        "total_requests_processed": system_stats.get("total_requests", 0),
        "active_sessions_count": len(active_sessions),
        "crisis_interventions_today": system_stats.get("crisis_interventions", 0),
        "agent_response_counts": system_stats.get("agent_responses", {}),
        "last_updated": datetime.now().isoformat()
    }

if __name__ == "__main__":
    # Fund agent if needed
    fund_agent_if_low(orchestrator.wallet.address())

    # Run the orchestrator
    orchestrator.run()
