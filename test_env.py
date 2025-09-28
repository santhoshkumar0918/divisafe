#!/usr/bin/env python3
"""
Environment Test for Divify Agent
"""

import os
from dotenv import load_dotenv

def test_environment():
    """Test if environment variables are loaded correctly"""

    print("🔍 TESTING ENVIRONMENT VARIABLES")
    print("=" * 40)

    # Test loading from backend/.env
    if os.path.exists('backend/.env'):
        print("✅ Found backend/.env file")
        load_dotenv('backend/.env')
    else:
        print("❌ backend/.env file not found!")
        print("💡 Please create backend/.env with your credentials")
        return

    # Check environment variables
    agentverse_key = os.getenv('AGENTVERSE_KEY')
    agent_seed_phrase = os.getenv('AGENT_SEED_PHRASE')

    print("
🔑 AGENTVERSE_KEY:"    if agentverse_key:
        print(f"   ✅ Found: {agentverse_key[:20]}...")
    else:
        print("   ❌ Not found!")

    print("
🌱 AGENT_SEED_PHRASE:"    if agent_seed_phrase:
        print(f"   ✅ Found: {agent_seed_phrase[:20]}...")
    else:
        print("   ❌ Not found!")

    if not agentverse_key or not agent_seed_phrase:
        print("
❌ Missing credentials!"        print("💡 Please add to backend/.env:")
        print("   AGENTVERSE_KEY=your_actual_key_here")
        print("   AGENT_SEED_PHRASE=your_12_word_phrase_here")

    return agentverse_key and agent_seed_phrase

if __name__ == "__main__":
    test_environment()
