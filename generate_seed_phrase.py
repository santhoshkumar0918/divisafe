#!/usr/bin/env python3
"""
Generate Agent Seed Phrase for Divorce Support MeTTa Agent
"""

import secrets
import os

def generate_secure_seed_phrase():
    """Generate a cryptographically secure seed phrase"""
    
    # Shortened but comprehensive word list (100 common, secure words)
    word_list = [
        'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
        'abuse', 'access', 'account', 'achieve', 'action', 'actor', 'actual', 'adapt',
        'address', 'admit', 'adult', 'advice', 'afraid', 'agent', 'agree', 'ahead',
        'alarm', 'album', 'alert', 'alien', 'alive', 'allow', 'almost', 'alone',
        'already', 'always', 'amazing', 'anchor', 'ancient', 'anger', 'animal', 'answer',
        'appear', 'apple', 'approve', 'argue', 'around', 'arrive', 'artist', 'assist',
        'attack', 'attend', 'attract', 'author', 'autumn', 'average', 'avoid', 'awake',
        'aware', 'awesome', 'baby', 'balance', 'banana', 'battle', 'beach', 'beauty',
        'become', 'before', 'begin', 'behave', 'believe', 'below', 'benefit', 'better',
        'beyond', 'bicycle', 'biology', 'birth', 'black', 'blood', 'board', 'bonus',
        'border', 'bottle', 'bottom', 'branch', 'brave', 'bread', 'break', 'bridge',
        'bright', 'bring', 'broken', 'brother', 'build', 'bundle', 'business', 'butter',
        'camera', 'cancel', 'cannot', 'canvas', 'carbon', 'career', 'carpet', 'castle',
        'casual', 'caught', 'cause', 'center', 'century', 'certain', 'change', 'charge'
    ]
    
    # Generate 12-word seed phrase using cryptographically secure random
    selected_words = [secrets.choice(word_list) for _ in range(12)]
    seed_phrase = ' '.join(selected_words)
    
    return seed_phrase

def save_to_env(seed_phrase):
    """Save seed phrase to .env file"""
    env_file = "backend/.env"
    
    # Create backend directory if it doesn't exist
    os.makedirs("backend", exist_ok=True)
    
    # Append to .env file
    with open(env_file, "a", encoding='utf-8') as f:
        f.write(f"\nAGENT_SEED_PHRASE={seed_phrase}\n")
    
    return env_file

def main():
    """Generate and display agent seed phrase"""
    
    print("🌱 DIVORCE SUPPORT METTA AGENT - SEED PHRASE GENERATOR")
    print("=" * 60)
    print("🏆 Competition Category: Most Effective ASI:One + MeTTa Integration")
    print("💰 Prize: $3,500 (1st Place)")
    
    print("\n🔐 Generating secure seed phrase...")
    
    # Generate seed phrase
    seed_phrase = generate_secure_seed_phrase()
    
    print("✅ Seed phrase generated successfully!")
    print(f"\n🌱 Your Agent Seed Phrase:\n{seed_phrase}")
    
    print("\n⚠️  IMPORTANT - SAVE THIS SEED PHRASE:")
    print("   1. Copy this phrase exactly")
    print("   2. Store it securely (password manager)")
    print("   3. Never share it or commit to Git")
    print("   4. Use this same phrase for all deployments")
    
    print("\n🔧 Setup Instructions:")
    print(f"   1. Set environment variable: $env:AGENT_SEED_PHRASE = '{seed_phrase}'")
    print("   2. Run registration: python register_on_agentverse.py")
    
    # Ask if they want to save it
    save_option = input("\n💾 Save this seed phrase to .env file? (y/n): ")
    
    if save_option.lower() == 'y':
        try:
            env_file = save_to_env(seed_phrase)
            print(f"✅ Seed phrase saved to {env_file}")
        except Exception as e:
            print(f"❌ Error saving to .env file: {e}")
    
    print("\n🎯 Next Steps:")
    print("   1. Set AGENTVERSE_KEY environment variable")
    print("   2. Set AGENT_SEED_PHRASE environment variable")
    print("   3. Run: python register_on_agentverse.py")
    print("   4. Your agent will be registered on Agentverse!")
    print("   5. Submit to Fetch.ai Innovation Lab for $3,500 prize!")

if __name__ == "__main__":
    main()