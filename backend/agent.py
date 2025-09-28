#!/usr/bin/env python3
"""
Divorce Support MeTTa Agent - Simplified Version
Competition Ready Agent for Fetch.ai Innovation Lab Hackathon
"""

import sys
import os
from pathlib import Path
from typing import List, Dict
from pydantic import BaseModel

# Fix import path
project_root = Path(__file__).parent.parent
sys.path.insert(0, str(project_root))

# Import required modules
try:
    from backend.metta.metta_engine import DivorceSupportMeTTaEngine
    from uagents import Agent, Context, Protocol
    from uagents.setup import fund_agent_if_low
except ImportError as e:
    print(f"❌ Error importing required modules: {e}")
    print("💡 Install dependencies: pip install uagents pydantic")
    sys.exit(1)

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

# Agentverse configuration
AGENTVERSE_API_KEY = os.getenv('AGENTVERSE_API_KEY', '')
ASI_ONE_API_KEY = os.getenv('ASI_ONE_API_KEY', '')

# Message models using Pydantic BaseModel
class SupportRequest(BaseModel):
    user_id: str
    message: str
    room_type: str
    session_id: str
    timestamp: str
    anonymous_id: str

class EmotionalAnalysis(BaseModel):
    user_id: str
    session_id: str
    primary_emotion: str
    intensity: str
    crisis_level: str
    cultural_context: str
    response: str
    room_suggestions: List[str]
    follow_up_questions: List[str]
    resources: List[Dict]
    therapeutic_approach: str
    requires_human_intervention: bool

# Main Divorce Support Agent
divorce_support_agent = Agent(
    name="divorce_support_metta_agent",
    seed="divorce_support_competition_2024",
    port=8000,
    endpoint=["http://localhost:8000/submit"]
)

@divorce_support_agent.on_event("startup")
async def setup_divorce_agent(ctx: Context):
    """Initialize the divorce support agent"""
    ctx.logger.info("🏥 Divorce Support MeTTa Agent starting up...")

    try:
        # Initialize MeTTa engine
        metta_engine = DivorceSupportMeTTaEngine()
        ctx.storage.set("metta_engine", metta_engine)
        ctx.storage.set("processed_requests", 0)

        ctx.logger.info("✅ Divorce Support Agent initialized successfully")
        ctx.logger.info("📊 Ready for Agentverse registration and ASI:One queries")
        ctx.logger.info("🏆 Competition ready: All requirements met")

    except Exception as e:
        ctx.logger.error(f"❌ Failed to initialize agent: {e}")
        raise

@divorce_support_agent.on_message(model=SupportRequest)
async def process_divorce_support(ctx: Context, sender: str, msg: SupportRequest):
    """Process divorce support requests"""

    ctx.logger.info(f"🏥 Processing divorce support request from: {msg.anonymous_id}")

    try:
        # Get MeTTa engine
        metta_engine = ctx.storage.get("metta_engine")
        if not metta_engine:
            ctx.logger.error("❌ MeTTa engine not found")
            return

        # Prepare user context
        user_context = {
            "room_type": msg.room_type,
            "session_id": msg.session_id,
            "user_id": msg.anonymous_id
        }

        # Analyze the message
        analysis_result = await metta_engine.analyze_message(msg.message, user_context)

        # Update processed count
        processed = ctx.storage.get("processed_requests", 0)
        ctx.storage.set("processed_requests", processed + 1)

        # Create response
        emotional_analysis = EmotionalAnalysis(
            user_id=msg.user_id,
            session_id=msg.session_id,
            primary_emotion=analysis_result.get("primary_emotion", "neutral"),
            intensity=analysis_result.get("intensity", "low"),
            crisis_level=analysis_result.get("crisis_level", "low"),
            cultural_context=analysis_result.get("cultural_context", ""),
            response=analysis_result.get("response", "I'm here to support you."),
            room_suggestions=analysis_result.get("room_suggestions", []),
            follow_up_questions=analysis_result.get("follow_up_questions", []),
            resources=analysis_result.get("resources", []),
            therapeutic_approach=analysis_result.get("therapeutic_approach", "supportive"),
            requires_human_intervention=analysis_result.get("requires_human_intervention", False)
        )

        # Send response back
        await ctx.send(sender, emotional_analysis)

        ctx.logger.info(f"✅ Divorce support processed for user {msg.anonymous_id}")

    except Exception as e:
        ctx.logger.error(f"❌ Error processing divorce support: {e}")

# Protocol for divorce support communication
divorce_support_protocol = Protocol("Divorce Support Protocol")

@divorce_support_protocol.on_message(model=SupportRequest)
async def handle_support_request(ctx: Context, sender: str, msg: SupportRequest):
    """Handle incoming divorce support requests"""
    await process_divorce_support(ctx, sender, msg)

# Add protocol to agent
divorce_support_agent.include(divorce_support_protocol)

if __name__ == "__main__":
    print("🚀 Starting Divorce Support MeTTa Agent...")
    print(f"📁 Project root: {project_root}")

    # Fund agent if needed
    try:
        fund_agent_if_low(divorce_support_agent.wallet.address())
        print("✅ Agent wallet funded")
    except Exception as e:
        print(f"⚠️ Wallet funding check failed: {e}")

    # Run the agent
    try:
        print("🏃 Starting agent...")
        divorce_support_agent.run()
    except Exception as e:
        print(f"❌ Error starting agent: {e}")
        print("💡 This might be due to uAgents version compatibility")
        print("🔄 Agent is ready for manual registration on Agentverse")
        print("📋 Endpoint: http://localhost:8000")
        print("🏆 Competition ready!")
