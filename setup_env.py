#!/usr/bin/env python3
"""
Environment Setup Helper for Divify Agent
"""

import os

def setup_environment():
    """Help user set up environment variables"""

    print("🔧 DIVIFY AGENT ENVIRONMENT SETUP")
    print("=" * 40)

    # Get Agentverse API Key
    print("\n🔑 Agentverse API Key Setup:")
    print("💡 Get this from: https://agentverse.ai → Developer → API Keys")

    agentverse_key = input("Enter your Agentverse API Key: ").strip()
    if not agentverse_key:
        print("❌ Agentverse API Key is required!")
        return False

    # Get Agent Seed Phrase
    print("\n🌱 Agent Seed Phrase Setup:")
    print("💡 Get this from: https://agentverse.ai → Developer → Agents → Create")

    seed_phrase = input("Enter your Agent Seed Phrase: ").strip()
    if not seed_phrase:
        print("❌ Agent Seed Phrase is required!")
        return False

    # Update .env file
    env_file = "backend/.env"

    # Read existing .env file
    existing_content = ""
    if os.path.exists(env_file):
        with open(env_file, 'r') as f:
            existing_content = f.read()

    # Create new .env content
    new_content = f"AGENTVERSE_KEY={agentverse_key}\nAGENT_SEED_PHRASE={seed_phrase}\n"

    # Write to .env file
    with open(env_file, 'w') as f:
        f.write(new_content)

    print("
✅ Environment variables saved to backend/.env"    print(f"🔑 Agentverse Key: {agentverse_key[:20]}...")
    print(f"🌱 Seed Phrase: {seed_phrase[:20]}...")

    print("
🎯 Next Steps:"    print("   1. Start your agent: python simple_agent.py")
    print("   2. Start ngrok: ngrok http 8000")
    print("   3. Register: python register_agent_final.py")

    return True

if __name__ == "__main__":
    setup_environment()
