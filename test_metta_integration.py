#!/usr/bin/env python3
"""
Test script for Standalone MeTTa Chat Integration
Tests the complete integration between frontend and backend
"""

import requests
import json
import time

def test_metta_integration():
    """Test the MeTTa chat API integration"""

    base_url = "http://localhost:8006"

    test_messages = [
        "I can't take this anymore, I feel like ending it all",
        "My husband left me and I'm so angry and betrayed",
        "I'm worried about how the kids will handle the divorce",
        "I feel like such a failure, this is all my fault",
        "I think there's hope for a better future after this",
        "My joint family is putting so much pressure on me about this divorce"
    ]

    print("🧪 Testing Standalone MeTTa Chat Integration")
    print("=" * 50)

    for i, message in enumerate(test_messages, 1):
        print(f"\n📝 Test {i}: '{message}'")

        try:
            response = requests.post(
                f"{base_url}/api/chat/analyze",
                json={
                    "message": message,
                    "user_context": {
                        "session_id": f"test_session_{i}"
                    }
                },
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                print("✅ Response received:")
                print(f"   📊 Emotional State: {result['emotional_state']['primary_emotion']} ({result['emotional_state']['intensity']})")
                print(f"   🚨 Crisis Alert: {result['crisis_alert']}")
                print(f"   👥 Human Intervention: {result['human_intervention']}")
                print(f"   🏠 Room Suggestions: {', '.join(result['room_suggestions'][:2])}")
                print(f"   📚 Resources: {len(result['resources'])} items")
                print(f"   💬 Response: {result['response'][:100]}...")
            else:
                print(f"❌ Error {response.status_code}: {response.text}")

        except requests.exceptions.RequestException as e:
            print(f"❌ Request failed: {e}")

        time.sleep(1)  # Brief pause between tests

    print("\n" + "=" * 50)
    print("🎯 Testing Emergency Resources...")

    try:
        response = requests.get(f"{base_url}/api/chat/emergency-resources", timeout=5)
        if response.status_code == 200:
            resources = response.json()
            print(f"✅ Emergency resources loaded: {len(resources['resources'])} resources")
            for resource in resources['resources'][:3]:
                print(f"   • {resource['name']}: {resource.get('phone', resource.get('text', 'N/A'))}")
        else:
            print(f"❌ Failed to load emergency resources: {response.status_code}")
    except Exception as e:
        print(f"❌ Error loading emergency resources: {e}")

    print("\n" + "=" * 50)
    print("🏥 Testing Available Rooms...")

    try:
        response = requests.get(f"{base_url}/api/chat/rooms", timeout=5)
        if response.status_code == 200:
            rooms = response.json()
            print(f"✅ Rooms loaded: {len(rooms['rooms'])} rooms")
            for room in rooms['rooms'][:5]:
                print(f"   • {room['name']}: {room['description'][:50]}...")
        else:
            print(f"❌ Failed to load rooms: {response.status_code}")
    except Exception as e:
        print(f"❌ Error loading rooms: {e}")

    print("\n" + "=" * 50)
    print("🎉 Standalone MeTTa Integration Test Complete!")
    print("\nNext steps:")
    print("1. Start the chat API server: python backend/chat_api.py")
    print("2. Start the frontend: npm run dev")
    print("3. Test the AI chat at: http://localhost:3000/ai-support")
    print("4. The AI will now use MeTTa emotional analysis!")

if __name__ == "__main__":
    print("⚠️  Make sure the chat API server is running on port 8005")
    print("   Run: python backend/chat_api.py")
    print()

    try:
        test_metta_integration()
    except KeyboardInterrupt:
        print("\n🛑 Test interrupted by user")
