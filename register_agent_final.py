import os
from uagents_core.utils.registration import (
    register_chat_agent,
    RegistrationRequestCredentials,
)

#!/usr/bin/env python3
"""
Divify Agent Registration Script
For Fetch.ai Innovation Lab Hackathon
"""

import os
from dotenv import load_dotenv
from uagents_core.utils.registration import (
    register_chat_agent,
    RegistrationRequestCredentials,
)

# Load environment variables from backend/.env
load_dotenv('backend/.env')

# Check if environment variables are set
agentverse_key = os.getenv('AGENTVERSE_KEY')
agent_seed_phrase = os.getenv('AGENT_SEED_PHRASE')

if not agentverse_key or not agent_seed_phrase:
    print("❌ Environment variables not found!")
    print("💡 Please set AGENTVERSE_KEY and AGENT_SEED_PHRASE in backend/.env")
    exit(1)

print("🚀 Registering Divify Agent on Agentverse...")
print(f"🔑 Agentverse Key: {agentverse_key[:20]}...")
print(f"🌱 Seed Phrase: {agent_seed_phrase[:20]}...")

# Register the agent
register_chat_agent(
    "divify",
    "https://ron-acred-francina.ngrok-free.dev",
    active=True,
    credentials=RegistrationRequestCredentials(
        agentverse_api_key=agentverse_key,
        agent_seed_phrase=agent_seed_phrase,
    ),
)

print("✅ SUCCESS! Divify agent registered on Agentverse!")
print("🎉 Your agent is now discoverable via ASI:One!")
print("🏆 Ready for hackathon submission!")