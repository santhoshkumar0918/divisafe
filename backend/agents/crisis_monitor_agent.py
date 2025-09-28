#!/usr/bin/env python3
"""
Crisis Monitor Agent for Divorce Support Platform
Monitors for crisis situations and coordinates emergency responses
"""

import asyncio
import json
from typing import Dict, List
from dataclasses import dataclass
from uagents import Agent, Context, Protocol
from uagents.setup import fund_agent_if_low
import sys
import pathlib
from datetime import datetime, timedelta

# Add parent directory to path for imports
sys.path.append(str(pathlib.Path(__file__).parent.parent))

@dataclass
class CrisisAlert:
    type: str
    user_id: str
    anonymous_id: str
    session_id: str
    crisis_type: str
    severity: str
    immediate_action: str
    crisis_resources: List[Dict]
    timestamp: str

@dataclass
class HumanEscalation:
    type: str
    user_id: str
    anonymous_id: str
    session_id: str
    reason: str
    priority: str
    emotional_analysis: Dict
    timestamp: str

# Crisis Monitor Agent
crisis_monitor = Agent(
    name="crisis_monitor",
    seed="divorce_support_crisis_monitor_2024",
    port=8003,
    endpoint=["http://localhost:8003/submit"]
)

@crisis_monitor.on_event("startup")
async def setup_crisis_monitor(ctx: Context):
    """Initialize the crisis monitor agent"""
    ctx.logger.info("🚨 Crisis Monitor Agent starting up...")

    # Initialize crisis tracking
    crisis_cases = {
        "total_detected": 0,
        "emergency_cases": 0,
        "high_priority_cases": 0,
        "resolved_cases": 0,
        "active_interventions": {},
        "human_escalations": 0
    }

    # Emergency contact resources
    emergency_resources = {
        "national": [
            {"name": "National Suicide Prevention Lifeline", "phone": "988", "available": "24/7"},
            {"name": "Crisis Text Line", "text": "HOME to 741741", "available": "24/7"},
            {"name": "National Domestic Violence Hotline", "phone": "1-800-799-7233", "available": "24/7"}
        ],
        "international": [
            {"name": "International Association for Suicide Prevention", "url": "https://www.iasp.info/resources/Crisis_Centres/"},
            {"name": "Befrienders Worldwide", "url": "https://www.befrienders.org/"}
        ]
    }

    ctx.storage.set("crisis_cases", crisis_cases)
    ctx.storage.set("emergency_resources", emergency_resources)
    ctx.storage.set("alerts_sent", 0)

    ctx.logger.info("✅ Crisis monitor initialized with emergency resources")

@crisis_monitor.on_message(model=CrisisAlert)
async def handle_crisis_alert(ctx: Context, sender: str, msg: CrisisAlert):
    """Handle incoming crisis alerts and coordinate response"""

    ctx.logger.warning(f"🚨 CRITICAL: Crisis alert received for user {msg.anonymous_id}")

    # Update crisis statistics
    crisis_cases = ctx.storage.get("crisis_cases")
    crisis_cases["total_detected"] += 1

    if msg.severity == "emergency":
        crisis_cases["emergency_cases"] += 1
    elif msg.severity == "high":
        crisis_cases["high_priority_cases"] += 1

    # Track active intervention
    active_interventions = crisis_cases["active_interventions"]
    active_interventions[msg.anonymous_id] = {
        "session_id": msg.session_id,
        "crisis_type": msg.crisis_type,
        "severity": msg.severity,
        "alerted_at": msg.timestamp,
        "status": "monitoring"
    }
    crisis_cases["active_interventions"] = active_interventions
    ctx.storage.set("crisis_cases", crisis_cases)

    # Send immediate response based on severity
    if msg.severity == "emergency":
        await handle_emergency_crisis(ctx, msg)
    else:
        await handle_high_priority_crisis(ctx, msg)

    # Send notification to orchestrator
    await ctx.send("divorce_support_orchestrator", {
        "type": "crisis_response_sent",
        "user_id": msg.user_id,
        "anonymous_id": msg.anonymous_id,
        "session_id": msg.session_id,
        "crisis_handled": True,
        "response_timestamp": datetime.now().isoformat()
    })

@crisis_monitor.on_message(model=HumanEscalation)
async def handle_human_escalation(ctx: Context, sender: str, msg: HumanEscalation):
    """Handle requests for human counselor intervention"""

    ctx.logger.info(f"👥 Human escalation requested for user: {msg.anonymous_id}")

    # Update escalation statistics
    crisis_cases = ctx.storage.get("crisis_cases")
    crisis_cases["human_escalations"] += 1
    ctx.storage.set("crisis_cases", crisis_cases)

    # Create human intervention request
    intervention_request = {
        "type": "human_intervention_required",
        "user_id": msg.user_id,
        "anonymous_id": msg.anonymous_id,
        "session_id": msg.session_id,
        "reason": msg.reason,
        "priority": msg.priority,
        "emotional_analysis": msg.emotional_analysis,
        "requested_at": msg.timestamp,
        "status": "pending_assignment"
    }

    # In a real implementation, this would:
    # 1. Alert on-call human counselors
    # 2. Send notifications via SMS/email/push
    # 3. Update counselor dashboard
    # 4. Track response times and outcomes

    # For now, simulate human intervention assignment
    await simulate_human_assignment(ctx, intervention_request)

    ctx.logger.info(f"👥 Human intervention assigned for user {msg.anonymous_id}")

async def handle_emergency_crisis(ctx: Context, crisis_alert: CrisisAlert):
    """Handle emergency-level crisis situations"""

    ctx.logger.critical(f"🚨 EMERGENCY: Immediate intervention required for user {crisis_alert.anonymous_id}")

    # Create emergency response
    emergency_response = {
        "type": "emergency_intervention",
        "user_id": crisis_alert.user_id,
        "anonymous_id": crisis_alert.anonymous_id,
        "session_id": crisis_alert.session_id,
        "crisis_type": crisis_alert.crisis_type,
        "immediate_actions": [
            "Contact emergency services if in immediate physical danger",
            "Call 988 (Suicide Prevention Lifeline) immediately",
            "Text HOME to 741741 (Crisis Text Line)",
            "Stay in the chat - human counselor joining shortly"
        ],
        "emergency_contacts": ctx.storage.get("emergency_resources")["national"],
        "crisis_counselor_alerted": True,
        "response_timestamp": datetime.now().isoformat()
    }

    # Send emergency response to orchestrator for immediate user notification
    await ctx.send("divorce_support_orchestrator", emergency_response)

    # Update alerts sent counter
    alerts_sent = ctx.storage.get("alerts_sent", 0)
    ctx.storage.set("alerts_sent", alerts_sent + 1)

    ctx.logger.critical(f"🚨 Emergency response sent for user {crisis_alert.anonymous_id}")

async def handle_high_priority_crisis(ctx: Context, crisis_alert: CrisisAlert):
    """Handle high-priority crisis situations"""

    ctx.logger.warning(f"⚠️ HIGH PRIORITY: Crisis intervention needed for user {crisis_alert.anonymous_id}")

    # Create high-priority response
    priority_response = {
        "type": "high_priority_intervention",
        "user_id": crisis_alert.user_id,
        "anonymous_id": crisis_alert.anonymous_id,
        "session_id": crisis_alert.session_id,
        "crisis_type": crisis_alert.crisis_type,
        "immediate_actions": [
            "Contact crisis counselor within 30 minutes",
            "Monitor user's messages closely for escalation",
            "Provide additional coping resources",
            "Consider room transfer to crisis-intervention"
        ],
        "support_resources": crisis_alert.crisis_resources,
        "counselor_alerted": True,
        "response_timestamp": datetime.now().isoformat()
    }

    # Send priority response to orchestrator
    await ctx.send("divorce_support_orchestrator", priority_response)

    # Update alerts sent counter
    alerts_sent = ctx.storage.get("alerts_sent", 0)
    ctx.storage.set("alerts_sent", alerts_sent + 1)

    ctx.logger.warning(f"⚠️ High priority response sent for user {crisis_alert.anonymous_id}")

async def simulate_human_assignment(ctx: Context, intervention_request: Dict):
    """Simulate human counselor assignment (in real implementation, this would be actual assignment)"""

    # Simulate assignment delay
    await asyncio.sleep(2)

    # Create assignment confirmation
    assignment_confirmation = {
        "type": "human_assigned",
        "user_id": intervention_request["user_id"],
        "anonymous_id": intervention_request["anonymous_id"],
        "session_id": intervention_request["session_id"],
        "assigned_counselor": f"counselor_{intervention_request['anonymous_id'][:8]}",  # Simulated counselor ID
        "estimated_response_time": "5-10 minutes",
        "assignment_timestamp": datetime.now().isoformat(),
        "specialization": "crisis_intervention"
    }

    # Send assignment confirmation to orchestrator
    await ctx.send("divorce_support_orchestrator", assignment_confirmation)

    ctx.logger.info(f"👥 Human counselor assigned for user {intervention_request['anonymous_id']}")

# Protocol for agent communication
crisis_monitoring_protocol = Protocol("Crisis Monitoring Protocol")

@crisis_monitoring_protocol.on_message(model=CrisisAlert)
async def handle_crisis_alert_protocol(ctx: Context, sender: str, msg: CrisisAlert):
    """Handle crisis alerts via protocol"""
    await handle_crisis_alert(ctx, sender, msg)

@crisis_monitoring_protocol.on_message(model=HumanEscalation)
async def handle_human_escalation_protocol(ctx: Context, sender: str, msg: HumanEscalation):
    """Handle human escalation requests via protocol"""
    await handle_human_escalation(ctx, sender, msg)

# Add protocol to agent
crisis_monitor.include(crisis_monitoring_protocol)

# Agent health check endpoint
@crisis_monitor.on_rest_get("/health")
async def health_check(ctx: Context):
    """Health check endpoint"""
    crisis_cases = ctx.storage.get("crisis_cases", {})
    alerts_sent = ctx.storage.get("alerts_sent", 0)

    return {
        "status": "healthy",
        "agent": "crisis_monitor",
        "crisis_cases": crisis_cases,
        "alerts_sent": alerts_sent,
        "active_interventions": len(crisis_cases.get("active_interventions", {}))
    }

# Periodic cleanup of resolved cases
@crisis_monitor.on_interval(period=300.0)  # Every 5 minutes
async def cleanup_resolved_cases(ctx: Context):
    """Clean up resolved crisis cases to prevent memory buildup"""

    crisis_cases = ctx.storage.get("crisis_cases", {})
    active_interventions = crisis_cases.get("active_interventions", {})

    # Remove interventions older than 24 hours (simulating resolution)
    current_time = datetime.now()
    resolved_count = 0

    for anonymous_id, intervention in list(active_interventions.items()):
        alerted_at = datetime.fromisoformat(intervention["alerted_at"])
        if current_time - alerted_at > timedelta(hours=24):
            del active_interventions[anonymous_id]
            resolved_count += 1

    if resolved_count > 0:
        crisis_cases["resolved_cases"] += resolved_count
        crisis_cases["active_interventions"] = active_interventions
        ctx.storage.set("crisis_cases", crisis_cases)

        ctx.logger.info(f"🧹 Cleaned up {resolved_count} resolved crisis cases")

if __name__ == "__main__":
    # Fund agent if needed
    fund_agent_if_low(crisis_monitor.wallet.address())

    # Run the agent
    crisis_monitor.run()
