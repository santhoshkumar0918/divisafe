#!/usr/bin/env python3
"""
Knowledge Base Agent for Divorce Support Platform
Provides relevant resources, articles, and information based on user needs
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
class ResourceRequest:
    user_id: str
    anonymous_id: str
    session_id: str
    emotional_state: str
    crisis_level: str
    cultural_context: str
    room_type: str
    timestamp: str

@dataclass
class ResourceResponse:
    user_id: str
    session_id: str
    resources: List[Dict]
    articles: List[Dict]
    support_groups: List[Dict]
    hotlines: List[Dict]
    personalized_recommendations: List[str]

# Knowledge Base Agent
knowledge_base = Agent(
    name="knowledge_base",
    seed="divorce_support_knowledge_base_2024",
    port=8004,
    endpoint=["http://localhost:8004/submit"]
)

@knowledge_base.on_event("startup")
async def setup_knowledge_base(ctx: Context):
    """Initialize the knowledge base agent with comprehensive resources"""
    ctx.logger.info("📚 Knowledge Base Agent starting up...")

    # Comprehensive resource database
    resource_database = {
        # Articles and Guides
        "articles": {
            "coping_strategies": [
                {
                    "id": 1,
                    "title": "Managing Anger During Divorce",
                    "url": "https://www.helpguide.org/articles/relationships-communication/anger-management.htm",
                    "category": "anger_management",
                    "description": "Practical strategies for handling anger during divorce proceedings"
                },
                {
                    "id": 2,
                    "title": "Grieving Your Marriage: The 5 Stages of Divorce Grief",
                    "url": "https://www.divorcemag.com/articles/grieving-your-marriage",
                    "category": "grief_support",
                    "description": "Understanding the emotional stages of divorce recovery"
                },
                {
                    "id": 3,
                    "title": "Financial Planning After Divorce",
                    "url": "https://www.womansdivorce.com/financial-planning.html",
                    "category": "financial_recovery",
                    "description": "Comprehensive guide to managing finances post-divorce"
                }
            ],
            "legal_resources": [
                {
                    "id": 4,
                    "title": "Understanding Your Legal Rights in Divorce",
                    "url": "https://www.nolo.com/legal-encyclopedia/divorce-rights",
                    "category": "legal_rights",
                    "description": "Overview of legal rights and responsibilities during divorce"
                },
                {
                    "id": 5,
                    "title": "Child Custody Laws and Guidelines",
                    "url": "https://www.divorcenet.com/topics/child-custody",
                    "category": "child_custody",
                    "description": "Information about child custody arrangements and laws"
                }
            ],
            "cultural_resources": [
                {
                    "id": 6,
                    "title": "Divorce in Indian Culture: Breaking the Stigma",
                    "url": "https://www.thebetterindia.com/divorce-indian-culture/",
                    "category": "indian_cultural",
                    "description": "Addressing cultural stigma around divorce in Indian society"
                },
                {
                    "id": 7,
                    "title": "Joint Family Dynamics During Divorce",
                    "url": "https://www.psychologytoday.com/divorce-joint-family",
                    "category": "family_dynamics",
                    "description": "Navigating family relationships during divorce"
                }
            ]
        },

        # Support Groups
        "support_groups": [
            {
                "id": 1,
                "name": "DivorceCare Support Groups",
                "location": "Online and In-Person",
                "schedule": "Weekly meetings",
                "url": "https://www.divorcecare.org/",
                "description": "Christian-based divorce recovery support groups"
            },
            {
                "id": 2,
                "name": "Single Parents Network",
                "location": "Various locations",
                "schedule": "Monthly meetings",
                "url": "https://singleparents.org/",
                "description": "Support for single parents navigating divorce"
            },
            {
                "id": 3,
                "name": "Indian Divorce Support Community",
                "location": "Online community",
                "schedule": "24/7 peer support",
                "url": "https://www.indian-divorce-support.org/",
                "description": "Culturally sensitive support for Indian divorcees"
            }
        ],

        # Crisis Hotlines
        "hotlines": [
            {
                "id": 1,
                "name": "National Suicide Prevention Lifeline",
                "number": "988",
                "availability": "24/7",
                "description": "Confidential emotional support and crisis intervention"
            },
            {
                "id": 2,
                "name": "Crisis Text Line",
                "number": "Text HOME to 741741",
                "availability": "24/7",
                "description": "Free, 24/7 crisis support via text message"
            },
            {
                "id": 3,
                "name": "National Domestic Violence Hotline",
                "number": "1-800-799-7233",
                "availability": "24/7",
                "description": "Support for domestic violence and abuse situations"
            },
            {
                "id": 4,
                "name": "Indian Women's Helpline",
                "number": "181",
                "availability": "24/7",
                "description": "Support for women facing domestic issues in India"
            }
        ],

        # Professional Services
        "professional_services": [
            {
                "id": 1,
                "type": "therapy",
                "name": "BetterHelp Online Therapy",
                "url": "https://www.betterhelp.com/",
                "description": "Affordable online therapy with licensed professionals"
            },
            {
                "id": 2,
                "type": "legal_aid",
                "name": "Legal Aid Society",
                "url": "https://www.lsc.gov/what-legal-aid/find-legal-aid",
                "description": "Free legal assistance for low-income individuals"
            },
            {
                "id": 3,
                "type": "financial_counseling",
                "name": "National Foundation for Credit Counseling",
                "url": "https://www.nfcc.org/",
                "description": "Non-profit financial counseling services"
            }
        ]
    }

    ctx.storage.set("resource_database", resource_database)
    ctx.storage.set("resources_provided", 0)

    ctx.logger.info(f"✅ Knowledge base initialized with {len(resource_database)} resource categories")

@knowledge_base.on_message(model=ResourceRequest)
async def provide_resources(ctx: Context, sender: str, msg: ResourceRequest):
    """Provide relevant resources based on user's emotional state and needs"""

    ctx.logger.info(f"📚 Providing resources for user: {msg.anonymous_id}")

    resource_database = ctx.storage.get("resource_database")

    # Determine resource categories based on emotional state and context
    relevant_resources = await determine_relevant_resources(
        ctx, msg, resource_database
    )

    # Update statistics
    resources_provided = ctx.storage.get("resources_provided", 0)
    ctx.storage.set("resources_provided", resources_provided + 1)

    # Create resource response
    resource_response = ResourceResponse(
        user_id=msg.user_id,
        session_id=msg.session_id,
        resources=relevant_resources.get("general_resources", []),
        articles=relevant_resources.get("articles", []),
        support_groups=relevant_resources.get("support_groups", []),
        hotlines=relevant_resources.get("hotlines", []),
        personalized_recommendations=relevant_resources.get("recommendations", [])
    )

    # Send resources to orchestrator
    await ctx.send("divorce_support_orchestrator", resource_response)

    ctx.logger.info(f"✅ Resources provided for user {msg.anonymous_id}")
    ctx.logger.info(f"   Articles: {len(resource_response.articles)}")
    ctx.logger.info(f"   Support groups: {len(resource_response.support_groups)}")
    ctx.logger.info(f"   Hotlines: {len(resource_response.hotlines)}")

async def determine_relevant_resources(ctx: Context, request: ResourceRequest, database: Dict) -> Dict:
    """Determine which resources are most relevant for the user's situation"""

    emotional_state = request.emotional_state.lower()
    crisis_level = request.crisis_level.lower()
    cultural_context = request.cultural_context.lower() if request.cultural_context else ""
    room_type = request.room_type.lower()

    resources = {
        "general_resources": [],
        "articles": [],
        "support_groups": [],
        "hotlines": [],
        "recommendations": []
    }

    # Crisis situations get immediate hotline resources
    if crisis_level in ["high", "emergency"]:
        resources["hotlines"] = database["hotlines"][:2]  # Top 2 crisis hotlines
        resources["recommendations"].append(
            "Please contact emergency services immediately if you're in physical danger"
        )
        resources["recommendations"].append(
            "A human counselor will be joining this chat shortly to provide immediate support"
        )

    # Emotional state-based resource matching
    if emotional_state == "anger":
        resources["articles"].extend([
            article for article in database["articles"]["coping_strategies"]
            if article["category"] == "anger_management"
        ])
        resources["recommendations"].append(
            "Consider anger management techniques like deep breathing and journaling"
        )

    elif emotional_state == "sadness":
        resources["articles"].extend([
            article for article in database["articles"]["coping_strategies"]
            if article["category"] == "grief_support"
        ])
        resources["recommendations"].append(
            "Grief counseling can be very helpful during this difficult time"
        )

    elif emotional_state == "anxiety":
        resources["articles"].extend([
            article for article in database["articles"]["coping_strategies"]
            if "financial" in article["category"] or "planning" in article["category"]
        ])
        resources["recommendations"].append(
            "Creating a structured plan can help reduce anxiety about the future"
        )

    # Room-based resource matching
    if "legal" in room_type:
        resources["articles"].extend(database["articles"]["legal_resources"])
        resources["general_resources"].extend(database["professional_services"])

    elif "financial" in room_type:
        resources["articles"].extend([
            article for article in database["articles"]["coping_strategies"]
            if article["category"] == "financial_recovery"
        ])
        resources["general_resources"].extend([
            service for service in database["professional_services"]
            if service["type"] == "financial_counseling"
        ])

    # Cultural context resources
    if cultural_context == "indian":
        resources["articles"].extend(database["articles"]["cultural_resources"])
        resources["support_groups"].append([
            group for group in database["support_groups"]
            if "Indian" in group["name"] or "indian" in group["name"].lower()
        ][0])

    # Default resources for general support
    if not resources["articles"] and not resources["hotlines"]:
        resources["articles"].extend(database["articles"]["coping_strategies"][:2])
        resources["support_groups"].extend(database["support_groups"][:1])

    # Always include general recommendations
    if not resources["recommendations"]:
        resources["recommendations"].extend([
            "Consider talking to a trusted friend or family member",
            "Professional therapy can provide valuable support during this time",
            "Self-care activities like exercise and meditation can help manage stress"
        ])

    return resources

# Protocol for agent communication
resource_protocol = Protocol("Resource Provision Protocol")

@resource_protocol.on_message(model=ResourceRequest)
async def handle_resource_request(ctx: Context, sender: str, msg: ResourceRequest):
    """Handle incoming resource requests"""
    await provide_resources(ctx, sender, msg)

# Add protocol to agent
knowledge_base.include(resource_protocol)

# Agent health check endpoint
@knowledge_base.on_rest_get("/health")
async def health_check(ctx: Context):
    """Health check endpoint"""
    resources_provided = ctx.storage.get("resources_provided", 0)
    resource_database = ctx.storage.get("resource_database", {})

    return {
        "status": "healthy",
        "agent": "knowledge_base",
        "resources_provided": resources_provided,
        "total_articles": len(resource_database.get("articles", {})),
        "total_support_groups": len(resource_database.get("support_groups", [])),
        "total_hotlines": len(resource_database.get("hotlines", []))
    }

if __name__ == "__main__":
    # Fund agent if needed
    fund_agent_if_low(knowledge_base.wallet.address())

    # Run the agent
    knowledge_base.run()
