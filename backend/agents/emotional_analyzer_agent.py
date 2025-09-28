#!/usr/bin/env python3
"""
Emotional Analyzer Agent for Divorce Support Platform
Uses MeTTa reasoning for real-time emotional analysis and crisis detection
"""

import asyncio
import json
import os
from typing import Dict, List
from dataclasses import dataclass
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
import sys
import pathlib

# Add parent directory to path for imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

from metta.metta_engine import DivorceSupportMeTTaEngine

@dataclass
class SupportRequest:
    user_id: str
    message: str
    room_type: str
    session_id: str
    timestamp: str
    anonymous_id: str

@dataclass
class EmotionalAnalysis:
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

# Emotional Analyzer Agent
emotional_analyzer = Agent(
    name="emotional_analyzer",
    seed="divorce_support_emotional_analyzer_2024",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)

@emotional_analyzer.on_event("startup")
async def setup_emotional_analyzer(ctx: Context):
    """Initialize the emotional analyzer agent with MeTTa engine"""
    ctx.logger.info("🧠 Emotional Analyzer Agent starting up...")

    try:
        # Initialize MeTTa engine
        metta_engine = DivorceSupportMeTTaEngine()
        ctx.storage.set("metta_engine", metta_engine)
        ctx.storage.set("processed_requests", 0)
        ctx.logger.info("✅ MeTTa engine initialized successfully")
    except Exception as e:
        ctx.logger.error(f"❌ Failed to initialize MeTTa engine: {e}")
        raise

@emotional_analyzer.on_message(model=SupportRequest)
async def analyze_emotion(ctx: Context, sender: str, msg: SupportRequest):
    """Analyze user's emotional state using MeTTa reasoning"""

    ctx.logger.info(f"🧠 Analyzing emotional state for user: {msg.anonymous_id}")

    try:
        # Get MeTTa engine
        metta_engine = ctx.storage.get("metta_engine")
        if not metta_engine:
            ctx.logger.error("❌ MeTTa engine not found in storage")
            return

        # Prepare user context
        user_context = {
            "room_type": msg.room_type,
            "session_id": msg.session_id,
            "user_id": msg.anonymous_id
        }

        # Analyze the message using MeTTa
        analysis_result = await metta_engine.analyze_message(msg.message, user_context)

        # Update processed count
        processed = ctx.storage.get("processed_requests", 0)
        ctx.storage.set("processed_requests", processed + 1)

        # Create emotional analysis response
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

        # Send analysis to orchestrator
        await ctx.send("divorce_support_orchestrator", emotional_analysis)

        ctx.logger.info(f"✅ Emotional analysis complete for user {msg.anonymous_id}")
        ctx.logger.info(f"   Primary emotion: {emotional_analysis.primary_emotion}")
        ctx.logger.info(f"   Crisis level: {emotional_analysis.crisis_level}")
        ctx.logger.info(f"   Human intervention needed: {emotional_analysis.requires_human_intervention}")

        # Handle crisis situations immediately
        if emotional_analysis.crisis_level == "emergency":
            await handle_crisis_emergency(ctx, emotional_analysis, msg)
        elif emotional_analysis.requires_human_intervention:
            await handle_human_escalation(ctx, emotional_analysis, msg)

    except Exception as e:
        ctx.logger.error(f"❌ Error in emotional analysis: {e}")
        # Send error response to orchestrator
        error_response = EmotionalAnalysis(
            user_id=msg.user_id,
            session_id=msg.session_id,
            primary_emotion="error",
            intensity="unknown",
            crisis_level="unknown",
            cultural_context="",
            response="I'm experiencing technical difficulties. Please try again in a moment.",
            room_suggestions=["general-support"],
            follow_up_questions=[],
            resources=[],
            therapeutic_approach="supportive",
            requires_human_intervention=False
        )
        await ctx.send("divorce_support_orchestrator", error_response)

async def handle_crisis_emergency(ctx: Context, analysis: EmotionalAnalysis, original_request: SupportRequest):
    """Handle emergency crisis situations"""

    ctx.logger.warning(f"🚨 EMERGENCY CRISIS DETECTED for user: {original_request.anonymous_id}")

    # Create crisis alert
    crisis_alert = {
        "type": "crisis_emergency",
        "user_id": original_request.user_id,
        "anonymous_id": original_request.anonymous_id,
        "session_id": original_request.session_id,
        "crisis_type": "suicidal_ideation",
        "severity": "emergency",
        "immediate_action": "human_intervention_required",
        "crisis_resources": analysis.resources,
        "timestamp": original_request.timestamp
    }

    # Send crisis alert to all relevant agents
    await ctx.send("crisis_monitor_agent", crisis_alert)
    await ctx.send("divorce_support_orchestrator", crisis_alert)

    ctx.logger.info(f"🚨 Emergency crisis alert sent for user {original_request.anonymous_id}")

async def handle_human_escalation(ctx: Context, analysis: EmotionalAnalysis, original_request: SupportRequest):
    """Handle cases requiring human counselor intervention"""

    ctx.logger.info(f"👥 Human intervention requested for user: {original_request.anonymous_id}")

    # Create escalation request
    escalation_request = {
        "type": "human_escalation",
        "user_id": original_request.user_id,
        "anonymous_id": original_request.anonymous_id,
        "session_id": original_request.session_id,
        "reason": f"High intensity {analysis.primary_emotion} requiring human support",
        "priority": "high" if analysis.crisis_level == "high" else "medium",
        "emotional_analysis": analysis,
        "timestamp": original_request.timestamp
    }

    # Send escalation request
    await ctx.send("crisis_monitor_agent", escalation_request)
    await ctx.send("divorce_support_orchestrator", escalation_request)

    ctx.logger.info(f"👥 Human escalation request sent for user {original_request.anonymous_id}")

# Protocol for agent communication
emotional_analysis_protocol = Protocol("Emotional Analysis Protocol")

@emotional_analysis_protocol.on_message(model=SupportRequest)
async def handle_support_request(ctx: Context, sender: str, msg: SupportRequest):
    """Handle incoming support requests for emotional analysis"""
    await analyze_emotion(ctx, sender, msg)

# Add protocol to agent
emotional_analyzer.include(emotional_analysis_protocol)

# Agent health check endpoint
@emotional_analyzer.on_rest_get("/health")
async def health_check(ctx: Context):
    """Health check endpoint"""
    processed_requests = ctx.storage.get("processed_requests", 0)
    return {
        "status": "healthy",
        "agent": "emotional_analyzer",
        "processed_requests": processed_requests,
        "metta_engine": "active"
    }

if __name__ == "__main__":
    # Fund agent if needed
    fund_agent_if_low(emotional_analyzer.wallet.address())

    # Run the agent
    emotional_analyzer.run()
