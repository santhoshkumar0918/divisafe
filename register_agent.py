#!/usr/bin/env python3
"""
Agentverse Registration Script for Divorce Support MeTTa Agent
Competition-ready agent registration for Fetch.ai Innovation Lab Hackathon
"""

import os
from uagents_core.utils.registration import (
    register_chat_agent,
    RegistrationRequestCredentials,
)

def register_divorce_support_agent():
    """Register the Divorce Support Agent on Agentverse"""

    print("🤖 Registering Divorce Support MeTTa Agent on Agentverse...")
    print("=" * 60)

    # Get required environment variables
    agentverse_key = os.getenv("AGENTVERSE_KEY")
    agent_seed_phrase = os.getenv("AGENT_SEED_PHRASE")

    if not agentverse_key:
        print("❌ AGENTVERSE_KEY environment variable not set!")
        print("💡 Please set: export AGENTVERSE_KEY='your_agentverse_api_key'")
        return False

    if not agent_seed_phrase:
        print("❌ AGENT_SEED_PHRASE environment variable not set!")
        print("💡 Please set: export AGENT_SEED_PHRASE='your_agent_seed_phrase'")
        return False

    # Your ngrok endpoint URL
    endpoint_url = "https://ron-acred-francina.ngrok-free.dev"

    print(f"🔗 Agent Endpoint: {endpoint_url}")
    print(f"🔑 Agentverse Key: {agentverse_key[:20]}...")
    print(f"🌱 Agent Seed: {agent_seed_phrase[:20]}...")

    try:
        # Register the chat agent
        print("\n📝 Registering agent with Agentverse...")
        register_chat_agent(
            "Divorce Support MeTTa Agent",
            endpoint_url,
            active=True,
            credentials=RegistrationRequestCredentials(
                agentverse_api_key=agentverse_key,
                agent_seed_phrase=agent_seed_phrase,
            ),
        )

        print("✅ Agent successfully registered on Agentverse!")
        print("🎉 Your agent is now discoverable via ASI:One!")
        print("🏆 Ready for hackathon submission!")

        return True

    except Exception as e:
        print(f"❌ Registration failed: {e}")
        print("🔧 Troubleshooting:")
        print("   1. Check your AGENTVERSE_KEY is correct")
        print("   2. Check your AGENT_SEED_PHRASE is correct")
        print("   3. Ensure ngrok is running: ngrok http 8000")
        print("   4. Verify your agent is accessible at the endpoint")
        return False

def check_agent_status():
    """Check if agent is properly configured"""
    print("\n🔍 Checking agent configuration...")

    # Check if .env file exists
    env_file = "backend/.env"
    if os.path.exists(env_file):
        print("✅ .env file found")
    else:
        print("⚠️ .env file not found - you'll need to create it")

    # Check if agent is running
    import requests
    try:
        response = requests.get("http://localhost:8000/health", timeout=5)
        if response.status_code == 200:
            health_data = response.json()
            print("✅ Agent is running and healthy"            print(f"   Status: {health_data.get('status')}")
            print(f"   MeTTa Engine: {health_data.get('metta_engine')}")
            print(f"   Competition Ready: {health_data.get('hackathon_ready')}")
        else:
            print("⚠️ Agent is running but not healthy")
    except:
        print("⚠️ Agent is not running on localhost:8000")
        print("   Start it with: python backend/agent.py")

def main():
    """Main registration function"""
    print("🏆 DIVORCE SUPPORT METTA AGENT - AGENTVERSE REGISTRATION")
    print("=" * 60)
    print("🎯 Competition Category: Most Effective ASI:One + MeTTa Integration")
    print("💰 Prize: $3,500 (1st Place)")

    # Check agent status first
    check_agent_status()

    # Ask for confirmation
    print("\n⚠️ Make sure:")
    print("   1. Your agent is running: python backend/agent.py")
    print("   2. ngrok is active: ngrok http 8000")
    print("   3. Endpoint is accessible: https://ron-acred-francina.ngrok-free.dev")

    confirm = input("\n🔑 Ready to register? Set AGENTVERSE_KEY and AGENT_SEED_PHRASE first (y/n): ")

    if confirm.lower() == 'y':
        success = register_divorce_support_agent()

        if success:
            print("\n🎉 REGISTRATION COMPLETE!")
            print("📋 Your agent is now:")
            print("   ✅ Registered on Agentverse")
            print("   ✅ Discoverable via ASI:One")
            print("   ✅ Ready for hackathon judging")
            print("   🏆 Eligible for $3,500 prize!")

            print("\n🔗 Next Steps:")
            print("   1. Keep ngrok running")
            print("   2. Keep your agent running")
            print("   3. Submit to Fetch.ai Innovation Lab")
            print("   4. Judges can now test your agent!")
        else:
            print("\n❌ Registration failed - please check your credentials")
    else:
        print("🔄 Registration cancelled")
        print("💡 Run this script again when ready")

if __name__ == "__main__":
    main()
