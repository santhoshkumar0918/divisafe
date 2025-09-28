#!/usr/bin/env python3
"""
Room Matcher Agent for Divorce Support Platform
Matches users to appropriate support rooms based on their needs and emotional state
"""

import asyncio
import json
from typing import Dict, List
from dataclasses import dataclass
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
import sys
import pathlib

# Add parent directory to path for imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

@dataclass
class RoomMatchRequest:
    user_id: str
    anonymous_id: str
    session_id: str
    emotional_state: str
    crisis_level: str
    cultural_context: str
    current_room: str
    timestamp: str

@dataclass
class RoomRecommendation:
    user_id: str
    session_id: str
    recommended_rooms: List[str]
    reasoning: str
    alternative_rooms: List[str]
    room_requirements: Dict

# Room Matcher Agent
room_matcher = Agent(
    name="room_matcher",
    seed="divorce_support_room_matcher_2024",
    port=8002,
    endpoint=["http://localhost:8002/submit"]
)

@room_matcher.on_event("startup")
async def setup_room_matcher(ctx: Context):
    """Initialize the room matcher agent with room configurations"""
    ctx.logger.info("🏠 Room Matcher Agent starting up...")

    # Define room configurations with capacity and requirements
    room_configurations = {
        # Crisis & Emergency Support
        "crisis-intervention": {
            "max_users": 10,
            "requires_verification": False,
            "category": "crisis",
            "ai_moderated": True,
            "human_moderated": True,
            "description": "24/7 emergency emotional support with human counselors",
            "priority": "emergency"
        },

        # General Support Rooms
        "general-support": {
            "max_users": 50,
            "requires_verification": False,
            "category": "general",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Open space for relationship discussions and general support",
            "priority": "low"
        },

        "post-divorce-recovery": {
            "max_users": 30,
            "requires_verification": True,
            "category": "recovery",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Support for life after divorce and rebuilding",
            "priority": "medium"
        },

        "co-parenting-support": {
            "max_users": 25,
            "requires_verification": True,
            "category": "parenting",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Managing relationships and co-parenting after divorce",
            "priority": "medium"
        },

        # Professional & Specialized Rooms
        "legal-consultation": {
            "max_users": 20,
            "requires_verification": True,
            "category": "professional",
            "ai_moderated": True,
            "human_moderated": True,
            "description": "Anonymous legal advice and consultation",
            "priority": "high"
        },

        "financial-recovery": {
            "max_users": 35,
            "requires_verification": False,
            "category": "professional",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Post-divorce financial planning and recovery",
            "priority": "medium"
        },

        # Demographic-Specific Rooms
        "womens-support": {
            "max_users": 35,
            "requires_verification": True,
            "category": "demographic",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Female-focused emotional support and empowerment",
            "priority": "medium"
        },

        "mens-support": {
            "max_users": 35,
            "requires_verification": True,
            "category": "demographic",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Male-focused mental health and relationship support",
            "priority": "medium"
        },

        # Cultural & Specialized Rooms
        "cultural-support": {
            "max_users": 30,
            "requires_verification": False,
            "category": "cultural",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Culturally sensitive support for diverse backgrounds",
            "priority": "medium"
        },

        "family-mediation": {
            "max_users": 20,
            "requires_verification": True,
            "category": "cultural",
            "ai_moderated": True,
            "human_moderated": True,
            "description": "Family conflict resolution and mediation support",
            "priority": "high"
        },

        # Recovery & Growth Rooms
        "anger-management": {
            "max_users": 20,
            "requires_verification": False,
            "category": "recovery",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Coping strategies and anger management techniques",
            "priority": "medium"
        },

        "emotional-support": {
            "max_users": 40,
            "requires_verification": False,
            "category": "recovery",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "General emotional support and coping strategies",
            "priority": "low"
        },

        "new-beginnings": {
            "max_users": 25,
            "requires_verification": False,
            "category": "recovery",
            "ai_moderated": True,
            "human_moderated": False,
            "description": "Planning for life after divorce and new beginnings",
            "priority": "low"
        }
    }

    # Initialize active rooms tracking
    active_rooms = {room_id: 0 for room_id in room_configurations.keys()}

    ctx.storage.set("room_configurations", room_configurations)
    ctx.storage.set("active_rooms", active_rooms)
    ctx.storage.set("matched_users", 0)

    ctx.logger.info(f"✅ Room configurations loaded for {len(room_configurations)} rooms")

@room_matcher.on_message(model=RoomMatchRequest)
async def match_user_to_room(ctx: Context, sender: str, msg: RoomMatchRequest):
    """Match user to appropriate support room based on emotional state and needs"""

    ctx.logger.info(f"🏠 Finding best room match for user: {msg.anonymous_id}")

    room_configurations = ctx.storage.get("room_configurations")
    active_rooms = ctx.storage.get("active_rooms", {})

    # Determine room matching strategy based on emotional state and crisis level
    recommended_rooms, reasoning = await determine_room_strategy(
        ctx, msg, room_configurations, active_rooms
    )

    # Check room availability and capacity
    available_rooms = []
    alternative_rooms = []

    for room_id in recommended_rooms:
        if room_id in room_configurations:
            current_users = active_rooms.get(room_id, 0)
            max_users = room_configurations[room_id]["max_users"]

            if current_users < max_users:
                available_rooms.append(room_id)
            else:
                alternative_rooms.append(room_id)

    # If no rooms available, suggest waiting or alternatives
    if not available_rooms:
        ctx.logger.warning(f"⚠️ No available rooms for user {msg.anonymous_id}")
        available_rooms = ["general-support"]  # Fallback to general support
        reasoning += " (All preferred rooms are full - using general support as fallback)"

    # Select the best available room
    selected_room = available_rooms[0]

    # Update active room count
    active_rooms[selected_room] = active_rooms.get(selected_room, 0) + 1
    ctx.storage.set("active_rooms", active_rooms)

    # Update matched users count
    matched_users = ctx.storage.get("matched_users", 0)
    ctx.storage.set("matched_users", matched_users + 1)

    # Get room requirements for the selected room
    room_requirements = room_configurations.get(selected_room, {})

    # Create room recommendation
    room_recommendation = RoomRecommendation(
        user_id=msg.user_id,
        session_id=msg.session_id,
        recommended_rooms=[selected_room] + available_rooms[1:],
        reasoning=reasoning,
        alternative_rooms=alternative_rooms,
        room_requirements=room_requirements
    )

    # Send recommendation to orchestrator
    await ctx.send("divorce_support_orchestrator", room_recommendation)

    ctx.logger.info(f"✅ Room match complete for user {msg.anonymous_id}")
    ctx.logger.info(f"   Selected room: {selected_room}")
    ctx.logger.info(f"   Reasoning: {reasoning}")

async def determine_room_strategy(ctx: Context, msg: RoomMatchRequest, room_configs: Dict, active_rooms: Dict) -> tuple[List[str], str]:
    """Determine the best room matching strategy based on user's emotional state"""

    emotional_state = msg.emotional_state.lower()
    crisis_level = msg.crisis_level.lower()
    cultural_context = msg.cultural_context.lower() if msg.cultural_context else ""

    # Crisis situations get priority placement
    if crisis_level == "emergency":
        return (["crisis-intervention"], "Emergency crisis situation - immediate intervention required")

    if crisis_level == "high":
        return (["crisis-intervention", "professional-counseling"], "High crisis level - professional intervention recommended")

    # Emotional state-based matching
    emotion_room_mapping = {
        "anger": ["anger-management", "legal-consultation", "general-support"],
        "sadness": ["post-divorce-recovery", "emotional-support", "grief-support"],
        "anxiety": ["co-parenting-support", "financial-recovery", "legal-advice", "general-support"],
        "guilt": ["emotional-support", "self-care-sanctuary", "professional-counseling"],
        "hopeless": ["crisis-intervention", "professional-counseling", "emotional-support"],
        "hope": ["new-beginnings", "post-divorce-recovery", "success-stories"],
        "neutral": ["general-support", "emotional-support"]
    }

    base_rooms = emotion_room_mapping.get(emotional_state, ["general-support"])

    # Cultural context adjustments
    if cultural_context == "indian":
        if emotional_state in ["anger", "guilt", "anxiety"]:
            # Add cultural support for Indian context
            base_rooms = ["cultural-support", "family-mediation"] + base_rooms
        elif emotional_state == "sadness":
            base_rooms = ["post-divorce-recovery", "cultural-support"] + base_rooms

    # Filter out unavailable rooms and prioritize by capacity
    available_rooms = []
    for room_id in base_rooms:
        if room_id in room_configs:
            current_users = active_rooms.get(room_id, 0)
            max_users = room_configs[room_id]["max_users"]
            if current_users < max_users:
                available_rooms.append(room_id)

    # If no rooms from primary matching available, add general support
    if not available_rooms:
        available_rooms = ["general-support"]

    reasoning = f"Emotional state: {emotional_state}, Crisis level: {crisis_level}, Cultural context: {cultural_context}"

    return available_rooms, reasoning

# Protocol for agent communication
room_matching_protocol = Protocol("Room Matching Protocol")

@room_matching_protocol.on_message(model=RoomMatchRequest)
async def handle_room_match_request(ctx: Context, sender: str, msg: RoomMatchRequest):
    """Handle incoming room matching requests"""
    await match_user_to_room(ctx, sender, msg)

# Add protocol to agent
room_matcher.include(room_matching_protocol)

# Agent health check endpoint
@room_matcher.on_rest_get("/health")
async def health_check(ctx: Context):
    """Health check endpoint"""
    matched_users = ctx.storage.get("matched_users", 0)
    active_rooms = ctx.storage.get("active_rooms", {})
    total_users = sum(active_rooms.values())

    return {
        "status": "healthy",
        "agent": "room_matcher",
        "matched_users": matched_users,
        "active_rooms": active_rooms,
        "total_active_users": total_users
    }

if __name__ == "__main__":
    # Fund agent if needed
    fund_agent_if_low(room_matcher.wallet.address())

    # Run the agent
    room_matcher.run()
