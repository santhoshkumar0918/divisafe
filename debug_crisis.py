#!/usr/bin/env python3
"""
Debug script to test crisis detection
"""

def analyze_emotions(message: str):
    message_lower = message.lower()
    print(f"Testing message: '{message}'")
    print(f"Lowercase: '{message_lower}'")

    crisis_keywords = {
        'suicidal': ["kill myself", "end it all", "better off dead", "no point living", "suicide", "not worth living", "end my life"],
        'self-harm': ["hurt myself", "cutting", "pills", "bridge", "overdose", "harm myself"],
        'severe-depression': ["can't go on", "worthless", "no hope", "everyone hates me", "failed at everything", "burden to everyone"]
    }

    # Crisis Detection (highest priority)
    for crisis_type, keywords in crisis_keywords.items():
        for keyword in keywords:
            print(f"  Checking crisis keyword: '{keyword}'")
            if keyword in message_lower:
                print(f"  ✅ MATCH FOUND: '{keyword}' in '{message_lower}'")
                return {
                    'crisis_detected': True,
                    'crisis_type': crisis_type,
                    'crisis_level': 'emergency' if crisis_type == 'suicidal' else 'high',
                }
            else:
                print(f"  ❌ No match: '{keyword}' not in '{message_lower}'")

    print("No crisis detected")
    return {'crisis_detected': False}

# Test the problematic message
test_message = "I can't take this anymore, I feel like ending it all"
result = analyze_emotions(test_message)
print(f"Result: {result}")
