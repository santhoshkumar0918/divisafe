#!/usr/bin/env python3
"""
Direct MeTTa Integration for Frontend Chat
Provides emotional analysis and support directly in the chat interface
"""

import asyncio
import json
import re
from typing import Dict, List, Optional
from dataclasses import dataclass
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class EmotionalAnalysis:
    primary_emotion: str
    intensity: str
    crisis_level: str
    cultural_context: Optional[str]
    room_suggestions: List[str]
    response: str
    follow_up_questions: List[str]
    resources: List[Dict]
    therapeutic_approach: str

class DirectMeTTaChatSupport:
    """Direct integration of MeTTa support into chat interface"""

    def __init__(self):
        # Simplified emotional analysis without full MeTTa engine
        self.emotion_keywords = self._load_emotion_keywords()
        self.crisis_keywords = self._load_crisis_keywords()
        self.cultural_indicators = self._load_cultural_indicators()

    def _load_emotion_keywords(self) -> Dict[str, List[str]]:
        """Load emotion detection keywords"""
        return {
            'anger': ["angry", "furious", "rage", "hate", "unfair", "betrayed", "infuriated", "mad", "outraged"],
            'sadness': ["sad", "depressed", "lonely", "empty", "heartbroken", "lost", "grieving", "miserable", "hopeless"],
            'anxiety': ["worried", "scared", "anxious", "nervous", "panic", "afraid", "stressed", "overwhelmed"],
            'guilt': ["guilty", "shame", "my fault", "should have", "regret", "responsible", "blame myself"],
            'hope': ["better", "future", "healing", "moving on", "strength", "optimistic", "positive", "confident"]
        }

    def _load_crisis_keywords(self) -> Dict[str, List[str]]:
        """Load crisis detection keywords"""
        return {
            'suicidal': ["kill myself", "end it all", "better off dead", "no point living", "suicide", "not worth living", "end my life"],
            'self-harm': ["hurt myself", "cutting", "pills", "bridge", "overdose", "harm myself"],
            'severe-depression': ["can't go on", "worthless", "no hope", "everyone hates me", "failed at everything", "burden to everyone"]
        }

    def _load_cultural_indicators(self) -> Dict[str, List[str]]:
        """Load cultural context indicators"""
        return {
            'indian': ["joint family", "arranged marriage", "dowry", "family honor", "social stigma", "community pressure", "parents", "elders"],
            'western': ["individual", "personal choice", "dating", "career", "independence", "freedom", "privacy"]
        }

    async def analyze_and_respond(self, message: str, user_context: Dict = None) -> Dict:
        """Analyze message and generate contextual response"""

        message_lower = message.lower()
        analysis = {}

        # Step 1: Crisis Detection (highest priority)
        crisis_result = self._detect_crisis(message_lower)
        if crisis_result:
            return self._create_crisis_response(crisis_result, message)

        # Step 2: Emotional Analysis
        emotional_analysis = self._analyze_emotions(message_lower)
        analysis.update(emotional_analysis)

        # Step 3: Cultural Context Detection
        cultural_context = self._detect_cultural_context(message_lower)
        if cultural_context:
            analysis['cultural_context'] = cultural_context

        # Step 4: Generate Response
        response_data = self._generate_response(analysis, message_lower, user_context or {})

        return response_data

    def _detect_crisis(self, message: str) -> Optional[Dict]:
        """Detect crisis situations using keyword matching"""

        for crisis_type, keywords in self.crisis_keywords.items():
            for keyword in keywords:
                if keyword in message:
                    return {
                        'type': crisis_type,
                        'level': 'emergency' if crisis_type == 'suicidal' else 'high',
                        'keyword': keyword,
                        'immediate_action': 'crisis_counselor' if crisis_type != 'suicidal' else 'immediate_intervention'
                    }

        return None

    def _analyze_emotions(self, message: str) -> Dict:
        """Analyze emotional content using keyword matching"""

        detected_emotions = {}
        intensity_scores = {'low': 0, 'medium': 0, 'high': 0}

        for emotion, keywords in self.emotion_keywords.items():
            matches = sum(1 for keyword in keywords if keyword in message)
            if matches > 0:
                detected_emotions[emotion] = matches
                # Determine intensity based on match count and context
                if matches >= 3:
                    intensity_scores['high'] += 1
                elif matches >= 2:
                    intensity_scores['medium'] += 1
                else:
                    intensity_scores['low'] += 1

        if not detected_emotions:
            return {
                'primary_emotion': 'neutral',
                'intensity': 'low',
                'crisis_level': 'low',
                'all_emotions': {}
            }

        # Determine primary emotion
        primary_emotion = max(detected_emotions.items(), key=lambda x: x[1])[0]
        intensity = max(intensity_scores.items(), key=lambda x: x[1])[0]

        return {
            'primary_emotion': primary_emotion,
            'intensity': intensity,
            'crisis_level': 'high' if intensity == 'high' and primary_emotion in ['sadness', 'hopeless'] else 'low',
            'all_emotions': detected_emotions
        }

    def _detect_cultural_context(self, message: str) -> Optional[str]:
        """Detect cultural context indicators"""

        for culture, indicators in self.cultural_indicators.items():
            for indicator in indicators:
                if indicator in message:
                    return culture

        return None

    def _generate_response(self, analysis: Dict, original_message: str, user_context: Dict) -> Dict:
        """Generate contextual response"""

        primary_emotion = analysis.get('primary_emotion', 'neutral')
        intensity = analysis.get('intensity', 'low')
        cultural_context = analysis.get('cultural_context')

        # Base responses by emotion
        emotion_responses = {
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

        # Select appropriate response
        response_options = emotion_responses.get(primary_emotion, [
            "I'm here to listen and support you through this difficult time.",
            "Thank you for sharing with me. How are you feeling about what you're going through?"
        ])
        selected_response = response_options[0]  # Could randomize for variety

        # Generate room suggestions based on emotion and context
        room_suggestions = self._suggest_rooms(primary_emotion, cultural_context, user_context)

        # Generate follow-up questions
        follow_up_questions = self._generate_follow_up_questions(primary_emotion)

        # Suggest resources
        resources = self._suggest_resources(primary_emotion, intensity)

        # Determine therapeutic approach
        therapeutic_approach = self._determine_therapeutic_approach(primary_emotion, intensity)

        return {
            'primary_emotion': primary_emotion,
            'intensity': intensity,
            'crisis_level': analysis.get('crisis_level', 'low'),
            'cultural_context': cultural_context,
            'response': selected_response,
            'room_suggestions': room_suggestions,
            'follow_up_questions': follow_up_questions,
            'resources': resources,
            'therapeutic_approach': therapeutic_approach,
            'requires_human_intervention': self._should_escalate_to_human(analysis)
        }

    def _suggest_rooms(self, emotion: str, cultural_context: str = None, user_context: Dict = None) -> List[str]:
        """Suggest appropriate rooms based on emotional state and context"""

        room_mapping = {
            'anger': ['anger-management', 'general-support', 'legal-consultation'],
            'sadness': ['post-divorce-recovery', 'emotional-support', 'success-stories'],
            'anxiety': ['pre-divorce-counseling', 'financial-planning', 'co-parenting-support'],
            'guilt': ['therapy-sessions', 'self-care-sanctuary', 'personal-transformation'],
            'hope': ['new-beginnings', 'dating-after-divorce', 'success-stories']
        }

        base_rooms = room_mapping.get(emotion, ['general-support'])

        # Add cultural context rooms
        if cultural_context == 'indian':
            if emotion in ['anger', 'guilt']:
                base_rooms.extend(['cultural-support', 'family-mediation'])
            elif emotion == 'sadness':
                base_rooms.extend(['community-support', 'spiritual-counseling'])

        return base_rooms

    def _generate_follow_up_questions(self, emotion: str) -> List[str]:
        """Generate follow-up questions to encourage deeper sharing"""

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

    def _suggest_resources(self, emotion: str, intensity: str) -> List[Dict]:
        """Suggest helpful resources based on emotional state"""

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

        # Add crisis resources if intensity is high
        if intensity == 'high':
            base_resources.extend([
                {"type": "hotline", "title": "National Suicide Prevention Lifeline", "contact": "988", "available": "24/7"},
                {"type": "hotline", "title": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"}
            ])

        return base_resources

    def _determine_therapeutic_approach(self, emotion: str, intensity: str) -> str:
        """Determine appropriate therapeutic approach"""

        if intensity == 'high' or emotion in ['hopeless', 'severe_depression']:
            return 'crisis-intervention'
        elif emotion in ['anger', 'anxiety']:
            return 'cognitive-behavioral'
        else:
            return 'supportive'

    def _should_escalate_to_human(self, analysis: Dict) -> bool:
        """Determine if case should be escalated to human counselor"""

        return (
            analysis.get('crisis_level') == 'high' or
            analysis.get('primary_emotion') == 'hopeless' or
            analysis.get('intensity') == 'high'
        )

    def _create_crisis_response(self, crisis_data: Dict, original_message: str) -> Dict:
        """Create immediate crisis response"""

        crisis_responses = {
            'suicidal': {
                'response': "I'm very concerned about you. Please reach out to emergency services or a crisis helpline immediately. You are not alone, and there are people who care deeply about you.",
                'crisis_level': 'emergency',
                'escalate_to': 'immediate_human_intervention',
                'resources': [
                    {"type": "emergency", "title": "National Suicide Prevention Lifeline", "contact": "988", "available": "24/7"},
                    {"type": "emergency", "title": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"},
                    {"type": "emergency", "title": "Emergency Services", "contact": "911", "available": "24/7"}
                ]
            },
            'self-harm': {
                'response': "I hear how much pain you're in. Please know that there are people who care and want to help you through this difficult time.",
                'crisis_level': 'high',
                'escalate_to': 'crisis_counselor',
                'resources': [
                    {"type": "hotline", "title": "National Suicide Prevention Lifeline", "contact": "988", "available": "24/7"},
                    {"type": "hotline", "title": "Crisis Text Line", "contact": "Text HOME to 741741", "available": "24/7"}
                ]
            }
        }

        response_data = crisis_responses.get(crisis_data['type'], crisis_responses['self-harm'])
        response_data.update({
            'crisis_detected': True,
            'crisis_type': crisis_data['type'],
            'immediate_action': crisis_data['immediate_action'],
            'room_suggestions': ['crisis-intervention'],
            'requires_human_intervention': True
        })

        return response_data

# Global instance for direct chat integration
chat_support = DirectMeTTaChatSupport()

async def analyze_chat_message(message: str, user_context: Dict = None) -> Dict:
    """Analyze chat message and return response"""
    return await chat_support.analyze_and_respond(message, user_context)

if __name__ == "__main__":
    # Test the direct integration
    async def test_direct_integration():
        test_messages = [
            "I can't take this anymore, I feel like ending it all",
            "My husband left me and I'm so angry and betrayed",
            "I'm worried about how the kids will handle the divorce",
            "I feel like such a failure, this is all my fault",
            "I think there's hope for a better future after this",
            "My joint family is putting so much pressure on me about this divorce"
        ]

        for message in test_messages:
            print(f"\n🧪 Testing: '{message}'")
            result = await analyze_chat_message(message)
            print(f"📊 Analysis: {json.dumps(result, indent=2)}")

    asyncio.run(test_direct_integration())
