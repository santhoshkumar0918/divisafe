#!/usr/bin/env python3
"""
Environment Check Script
"""

import os
from dotenv import load_dotenv

def check_env():
    """Check environment variables"""
    print("🔍 Checking environment variables...")

    # Try loading from backend/.env
    load_dotenv('backend/.env')

    agentverse_key = os.getenv('AGENTVERSE_KEY')
    agent_seed_phrase = os.getenv('AGENT_SEED_PHRASE')

    print(f"AGENTVERSE_KEY: {'✅ Found' if agentverse_key else '❌ Not found'}")
    print(f"AGENT_SEED_PHRASE: {'✅ Found' if agent_seed_phrase else '❌ Not found'}")

    if not agentverse_key or not agent_seed_phrase:
        print("\n💡 To fix:")
        print("1. Open backend/.env file")
        print("2. Add your actual Agentverse API key and seed phrase")
        print("3. Format: AGENTVERSE_KEY=your_key_here")
        print("4. Format: AGENT_SEED_PHRASE=your_seed_phrase_here")

    return agentverse_key, agent_seed_phrase

if __name__ == "__main__":
    check_env()
