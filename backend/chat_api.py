#!/usr/bin/env python3
"""
Standalone MeTTa Chat API
Provides MeTTa-powered emotional analysis directly to frontend
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import asyncio
import json
import uvicorn
import re
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Divorce Support Chat API", version="1.0.0")

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatMessage(BaseModel):
    message: str
    user_context: Optional[Dict] = None
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    emotional_state: Dict
    room_suggestions: List[str]
    resources: List[Dict]
    crisis_alert: bool
    human_intervention: bool
    follow_up_questions: List[str]

# Simplified MeTTa-style analysis functions
def analyze_emotions(message: str) -> Dict:
    """Analyze emotional content using keyword matching"""
    message_lower = message.lower()

    emotion_keywords = {
        'anger': ["angry", "furious", "rage", "hate", "unfair", "betrayed", "infuriated", "mad", "outraged"],
        'sadness': ["sad", "depressed", "lonely", "empty", "heartbroken", "lost", "grieving", "miserable", "hopeless"],
        'anxiety': ["worried", "scared", "anxious", "nervous", "panic", "afraid", "stressed", "overwhelmed"],
        'guilt': ["guilty", "shame", "my fault", "should have", "regret", "responsible", "blame myself"],
        'hope': ["better", "future", "healing", "moving on", "strength", "optimistic", "positive", "confident"]
    }

    crisis_keywords = {
        'suicidal': ["kill myself", "end it all", "better off dead", "no point living", "suicide", "not worth living", "end my life"],
        'self-harm': ["hurt myself", "cutting", "pills", "bridge", "overdose", "harm myself"],
        'severe-depression': ["can't go on", "worthless", "no hope", "everyone hates me", "failed at everything", "burden to everyone"]
    }

    cultural_indicators = {
        'indian': ["joint family", "arranged marriage", "dowry", "family honor", "social stigma", "community pressure", "parents", "elders"],
        'western': ["individual", "personal choice", "dating", "career", "independence", "freedom", "privacy"]
    }

    # Crisis Detection (highest priority)
    for crisis_type, keywords in crisis_keywords.items():
        for keyword in keywords:
            if keyword in message_lower:
                return {
                    'crisis_detected': True,
                    'crisis_type': crisis_type,
                    'crisis_level': 'emergency' if crisis_type == 'suicidal' else 'high',
                    'response': "I'm very concerned about you. Please reach out to emergency services or a crisis helpline immediately. You are not alone, and there are people who care deeply about you.",
                    'resources': [
                        {"type": "emergency", "title": "National Suicide Prevention Lifeline", "contact": "988", "available": "24/7"},
                        {"type": "emergency", "title": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"},
                        {"type": "emergency", "title": "Emergency Services", "contact": "911", "available": "24/7"}
                    ]
                }

    # Emotional Analysis
    detected_emotions = {}
    intensity_scores = {'low': 0, 'medium': 0, 'high': 0}

    for emotion, keywords in emotion_keywords.items():
        matches = sum(1 for keyword in keywords if keyword in message_lower)
        if matches > 0:
            detected_emotions[emotion] = matches
            if matches >= 3:
                intensity_scores['high'] += 1
            elif matches >= 2:
                intensity_scores['medium'] += 1
            else:
                intensity_scores['low'] += 1

    if not detected_emotions:
        primary_emotion = 'neutral'
        intensity = 'low'
        crisis_level = 'low'
    else:
        primary_emotion = max(detected_emotions.items(), key=lambda x: x[1])[0]
        intensity = max(intensity_scores.items(), key=lambda x: x[1])[0]
        crisis_level = 'high' if intensity == 'high' and primary_emotion in ['sadness', 'hopeless'] else 'low'

    # Cultural Context Detection
    cultural_context = None
    for culture, indicators in cultural_indicators.items():
        for indicator in indicators:
            if indicator in message_lower:
                cultural_context = culture
                break
        if cultural_context:
            break

    return {
        'crisis_detected': False,
        'primary_emotion': primary_emotion,
        'intensity': intensity,
        'crisis_level': crisis_level,
        'cultural_context': cultural_context,
        'response': generate_response(primary_emotion, intensity, cultural_context),
        'room_suggestions': generate_room_suggestions(primary_emotion, cultural_context),
        'resources': generate_resources(primary_emotion, intensity),
        'follow_up_questions': generate_follow_up_questions(primary_emotion),
        'requires_human_intervention': crisis_level == 'high' or primary_emotion == 'hopeless' or intensity == 'high'
    }

def generate_response(emotion: str, intensity: str, cultural_context: str = None) -> str:
    """Generate contextual response"""
    responses = {
        'anger': [
            "I can hear the anger in your words. Anger during divorce is completely normal - it shows you cared deeply about your relationship.",
            "It sounds like you're feeling really angry right now. That's a valid emotion. What's making you feel most angry about this situation?"
        ],
        'sadness': [
            "I sense deep sadness in what you're sharing. Divorce grief is real grief - you're mourning the loss of dreams and plans you had together.",
            "Your sadness shows how much this relationship meant to you. It's okay to feel this way. Healing takes time."
        ],
        'anxiety': [
            "I can feel the anxiety in your message. Uncertainty about the future during divorce is one of the hardest parts. You're not alone in feeling this way.",
            "Divorce anxiety is incredibly common. The unknown can feel overwhelming, but we can work through this one step at a time."
        ],
        'guilt': [
            "I hear self-blame in your words. Remember that relationships involve two people, and it's rarely entirely one person's fault.",
            "Guilt is common during divorce, but please be gentle with yourself. You're human, and you did the best you could with what you knew then."
        ],
        'hope': [
            "I'm glad to hear some hope in your message. That takes real strength, especially during such a difficult time.",
            "Your hope is inspiring. Many people have walked this path and found happiness again. You can too."
        ]
    }

    response_options = responses.get(emotion, [
        "I'm here to listen and support you through this difficult time.",
        "Thank you for sharing with me. How are you feeling about what you're going through?"
    ])

    return response_options[0]

def generate_room_suggestions(emotion: str, cultural_context: str = None) -> List[str]:
    """Generate room suggestions based on emotion and context"""
    room_mapping = {
        'anger': ['anger-management', 'general-support', 'legal-consultation'],
        'sadness': ['post-divorce-recovery', 'emotional-support', 'success-stories'],
        'anxiety': ['pre-divorce-counseling', 'financial-planning', 'co-parenting-support'],
        'guilt': ['therapy-sessions', 'self-care-sanctuary', 'personal-transformation'],
        'hope': ['new-beginnings', 'dating-after-divorce', 'success-stories']
    }

    base_rooms = room_mapping.get(emotion, ['general-support'])

    if cultural_context == 'indian':
        if emotion in ['anger', 'guilt']:
            base_rooms.extend(['cultural-support', 'family-mediation'])
        elif emotion == 'sadness':
            base_rooms.extend(['community-support', 'spiritual-counseling'])

    return base_rooms

def generate_resources(emotion: str, intensity: str) -> List[Dict]:
    """Generate resources based on emotional state"""
    resources = {
        'anger': [
            {"type": "article", "title": "Managing Anger During Divorce", "category": "coping-strategies", "url": "https://www.helpguide.org/articles/relationships-communication/anger-management.htm"},
            {"type": "audio", "title": "Anger Management Meditation", "category": "self-care", "url": "https://www.mindful.org/mindfulness-meditation-anger/"}
        ],
        'sadness': [
            {"type": "article", "title": "Grieving Your Marriage", "category": "healing", "url": "https://www.divorcemag.com/articles/grieving-your-marriage"},
            {"type": "support-group", "title": "DivorceCare Support Groups", "category": "community", "url": "https://www.divorcecare.org/"}
        ],
        'anxiety': [
            {"type": "guide", "title": "Divorce Planning Checklist", "category": "practical", "url": "https://www.womansdivorce.com/divorce-planning.html"},
            {"type": "audio", "title": "Anxiety Relief Techniques", "category": "self-care", "url": "https://www.calm.com/blog/anxiety-relief"}
        ]
    }

    base_resources = resources.get(emotion, [])

    if intensity == 'high':
        base_resources.extend([
            {"type": "hotline", "title": "National Suicide Prevention Lifeline", "contact": "988", "available": "24/7"},
            {"type": "hotline", "title": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"}
        ])

    return base_resources

def generate_follow_up_questions(emotion: str) -> List[str]:
    """Generate follow-up questions"""
    follow_ups = {
        'anger': [
            "What aspect of the divorce process is making you feel most angry?",
            "Have you been able to talk to anyone about these feelings?",
            "What would help you feel more in control right now?"
        ],
        'sadness': [
            "What do you miss most about your relationship?",
            "What would help you feel supported right now?",
            "What small step could you take toward healing?"
        ],
        'anxiety': [
            "What specific aspects of the future worry you most?",
            "What would make you feel more secure during this transition?",
            "Who in your support network can you reach out to?"
        ],
        'guilt': [
            "What specifically do you feel guilty about?",
            "Have you considered that both people contribute to relationship challenges?",
            "What would self-compassion look like for you right now?"
        ]
    }

    return follow_ups.get(emotion, ["How are you taking care of yourself during this time?"])

@app.post("/api/chat/analyze", response_model=ChatResponse)
async def analyze_message(request: ChatMessage):
    """Analyze chat message and return AI response with emotional analysis"""

    try:
        # Analyze the message using simplified MeTTa logic
        analysis_result = analyze_emotions(request.message)

        if analysis_result['crisis_detected']:
            # Crisis response
            chat_response = ChatResponse(
                response=analysis_result['response'],
                emotional_state={
                    "primary_emotion": "crisis",
                    "intensity": "emergency",
                    "crisis_level": analysis_result['crisis_level'],
                    "cultural_context": analysis_result.get('cultural_context', "")
                },
                room_suggestions=["crisis-intervention"],
                resources=analysis_result['resources'],
                crisis_alert=True,
                human_intervention=True,
                follow_up_questions=["Please contact emergency services immediately"]
            )
        else:
            # Normal response
            chat_response = ChatResponse(
                response=analysis_result['response'],
                emotional_state={
                    "primary_emotion": analysis_result['primary_emotion'],
                    "intensity": analysis_result['intensity'],
                    "crisis_level": analysis_result['crisis_level'],
                    "cultural_context": analysis_result.get('cultural_context', "")
                },
                room_suggestions=analysis_result['room_suggestions'],
                resources=analysis_result['resources'],
                crisis_alert=False,
                human_intervention=analysis_result['requires_human_intervention'],
                follow_up_questions=analysis_result['follow_up_questions']
            )

        return chat_response

    except Exception as e:
        logger.error(f"Analysis error: {e}")
        raise HTTPException(status_code=500, detail=f"Analysis error: {str(e)}")

@app.get("/api/chat/rooms")
async def get_available_rooms():
    """Get available support rooms"""
    rooms = [
        {
            "id": "general-support",
            "name": "General Support",
            "description": "Open space for relationship discussions and general support",
            "user_count": 0,
            "max_users": 50,
            "category": "general",
            "requires_verification": False
        },
        {
            "id": "crisis-intervention",
            "name": "Crisis Intervention",
            "description": "24/7 emergency emotional support with human counselors",
            "user_count": 0,
            "max_users": 10,
            "category": "crisis",
            "requires_verification": False
        },
        {
            "id": "emotional-support",
            "name": "Emotional Support",
            "description": "Focused emotional support and coping strategies",
            "user_count": 0,
            "max_users": 40,
            "category": "emotional",
            "requires_verification": False
        },
        {
            "id": "anger-management",
            "name": "Anger Management",
            "description": "Coping strategies and anger management techniques",
            "user_count": 0,
            "max_users": 20,
            "category": "recovery",
            "requires_verification": False
        }
    ]
    return {"success": True, "rooms": rooms}

@app.get("/api/chat/emergency-resources")
async def get_emergency_resources():
    """Get emergency contact resources"""
    resources = [
        {
            "name": "National Suicide Prevention Lifeline",
            "phone": "988",
            "text": "N/A",
            "available": "24/7",
            "description": "Confidential emotional support and crisis intervention"
        },
        {
            "name": "Crisis Text Line",
            "phone": "N/A",
            "text": "Text HOME to 741741",
            "available": "24/7",
            "description": "Free, 24/7 crisis support via text message"
        },
        {
            "name": "National Domestic Violence Hotline",
            "phone": "1-800-799-7233",
            "text": "N/A",
            "available": "24/7",
            "description": "Support for domestic violence and abuse situations"
        }
    ]
    return {"success": True, "resources": resources}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "chat_api",
        "version": "1.0.0",
        "features": [
            "MeTTa emotional analysis",
            "Crisis detection",
            "Cultural sensitivity",
            "Real-time responses"
        ]
    }

if __name__ == "__main__":
    print("🚀 Starting MeTTa Chat API on http://localhost:8006")
    print("📊 Features: Emotional analysis, Crisis detection, Cultural sensitivity")
    uvicorn.run(app, host="0.0.0.0", port=8006)
