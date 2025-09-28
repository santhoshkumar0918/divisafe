#!/usr/bin/env python3
"""
Utils for Divorce Support MeTTa Agent
LLM integration and query processing following competition template
"""

import asyncio
import json
import re
from typing import Dict, List, Tuple, Optional
import logging
import requests
from datetime import datetime

logger = logging.getLogger(__name__)

class DivorceRAG:
    """
    Retrieval-Augmented Generation system for divorce support
    Following competition template structure
    """

    def __init__(self, metta_instance):
        self.metta = metta_instance
        self.divorce_database = self._load_divorce_database()

    def _load_divorce_database(self) -> Dict:
        """Load divorce support knowledge database"""
        return {
            "crisis_resources": {
                "suicide_prevention": {
                    "phone": "988",
                    "text": "741741",
                    "description": "24/7 crisis support"
                },
                "domestic_violence": {
                    "phone": "1-800-799-7233",
                    "description": "Support for domestic abuse situations"
                }
            },
            "emotional_support": {
                "anger_management": {
                    "strategies": ["deep breathing", "journaling", "physical exercise", "professional therapy"],
                    "resources": ["https://www.helpguide.org/articles/relationships-communication/anger-management.htm"]
                },
                "grief_support": {
                    "stages": ["denial", "anger", "bargaining", "depression", "acceptance"],
                    "coping": ["support groups", "therapy", "self-care", "social connection"]
                }
            },
            "cultural_support": {
                "indian_context": {
                    "considerations": ["joint family dynamics", "social stigma", "community pressure"],
                    "approaches": ["culturally sensitive counseling", "family mediation", "community resources"]
                }
            }
        }

    def query_crisis_support(self, crisis_type: str) -> Dict:
        """Query crisis support resources"""
        try:
            resources = self.divorce_database.get("crisis_resources", {})
            if crisis_type == "suicidal":
                return resources.get("suicide_prevention", {})
            elif crisis_type == "domestic_violence":
                return resources.get("domestic_violence", {})
            return {"message": "Contact emergency services immediately"}
        except Exception as e:
            logger.error(f"❌ Crisis query failed: {e}")
            return {"error": "Unable to retrieve crisis resources"}

    def query_emotional_support(self, emotion: str) -> Dict:
        """Query emotional support strategies"""
        try:
            support = self.divorce_database.get("emotional_support", {})
            if emotion == "anger":
                return support.get("anger_management", {})
            elif emotion in ["sadness", "grief"]:
                return support.get("grief_support", {})
            return {"message": "General emotional support available"}
        except Exception as e:
            logger.error(f"❌ Emotional support query failed: {e}")
            return {"error": "Unable to retrieve emotional support"}

    def query_cultural_support(self, culture: str) -> Dict:
        """Query cultural support resources"""
        try:
            cultural = self.divorce_database.get("cultural_support", {})
            if culture == "indian":
                return cultural.get("indian_context", {})
            return {"message": "Culturally sensitive support available"}
        except Exception as e:
            logger.error(f"❌ Cultural support query failed: {e}")
            return {"error": "Unable to retrieve cultural support"}

    def add_knowledge(self, category: str, key: str, value: str):
        """Add new knowledge to the database dynamically"""
        try:
            if category not in self.divorce_database:
                self.divorce_database[category] = {}

            self.divorce_database[category][key] = value
            logger.info(f"✅ Added knowledge: {category}.{key} = {value}")
            return True
        except Exception as e:
            logger.error(f"❌ Failed to add knowledge: {e}")
            return False

class LLMIntegration:
    """
    LLM integration for enhanced responses
    Following competition template patterns
    """

    def __init__(self):
        self.api_key = os.getenv("ASI_ONE_API_KEY", "")
        self.endpoint = "https://api.asi1.ai/v1/chat/completions"

    async def generate_response(self, prompt: str, context: Dict = None) -> str:
        """Generate LLM response with context"""
        try:
            # Enhanced prompt with MeTTa context
            system_prompt = f"""
            You are an AI emotional support companion for people going through divorce.
            You provide empathetic, supportive responses using this context:

            Primary Emotion: {context.get('primary_emotion', 'neutral')}
            Intensity: {context.get('intensity', 'low')}
            Crisis Level: {context.get('crisis_level', 'low')}
            Cultural Context: {context.get('cultural_context', 'none')}

            Response Guidelines:
            - Be empathetic and validating
            - Provide practical support when appropriate
            - Include relevant resources if needed
            - Adapt tone to emotional intensity
            - Be culturally sensitive

            Keep responses supportive, helpful, and focused on emotional wellbeing.
            """

            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": prompt}
            ]

            response = await self._call_asi_api(messages)

            if context.get('crisis_level') == 'emergency':
                response += "\n\n🚨 Please contact emergency services immediately if you're in danger."

            return response

        except Exception as e:
            logger.error(f"❌ LLM response generation failed: {e}")
            return "I'm here to support you. Please share how you're feeling."

    async def _call_asi_api(self, messages: List[Dict]) -> str:
        """Call ASI:One API"""
        try:
            response = requests.post(
                self.endpoint,
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "asi1-mini",
                    "messages": messages,
                    "max_tokens": 500,
                    "temperature": 0.7
                },
                timeout=10
            )

            if response.status_code == 200:
                result = response.json()
                return result["choices"][0]["message"]["content"]
            else:
                logger.error(f"❌ ASI API error: {response.status_code}")
                return "I'm having trouble connecting. Please try again."

        except Exception as e:
            logger.error(f"❌ ASI API call failed: {e}")
            return "I'm experiencing technical difficulties. Please try again in a moment."

def get_intent_and_keyword(query: str, metta_instance) -> Tuple[str, List[str]]:
    """
    Classify user intent and extract keywords using MeTTa
    Following competition template implementation
    """

    try:
        # Use MeTTa for intent classification
        intent_query = f'''
        (let $message "{query.lower()}")
        (let $intents (match &self (intent $intent) (keywords $keywords)))
        (let $matches (filter (L $intent $keywords)
                               (any (L $keyword) (contains $message $keyword) $keywords)))
        (if (empty $matches)
            "general-support"
            (car $matches)))
        '''

        intent_result = metta_instance.run(intent_query)

        # Extract keywords using simple pattern matching
        keywords = extract_divorce_keywords(query)

        logger.info(f"✅ Intent: {intent_result}, Keywords: {keywords}")
        return str(intent_result), keywords

    except Exception as e:
        logger.error(f"❌ Intent classification failed: {e}")
        return "general-support", []

def extract_divorce_keywords(text: str) -> List[str]:
    """Extract divorce-related keywords from text"""
    divorce_keywords = [
        "divorce", "separation", "breakup", "custody", "support", "help", "crisis",
        "anger", "sadness", "anxiety", "guilt", "hope", "family", "legal",
        "financial", "emotional", "cultural", "indian", "western", "joint family",
        "arranged marriage", "social stigma", "community pressure"
    ]

    found_keywords = []
    text_lower = text.lower()

    for keyword in divorce_keywords:
        if keyword in text_lower:
            found_keywords.append(keyword)

    return found_keywords

async def process_query(query: str, rag: DivorceRAG, llm: LLMIntegration) -> str:
    """
    Process user query using MeTTa and LLM integration
    Following competition template structure
    """

    try:
        # Classify intent and extract keywords
        intent, keywords = get_intent_and_keyword(query, rag.metta)

        # Get MeTTa analysis context
        metta_context = await get_metta_context(query, rag.metta)

        # Generate enhanced response using LLM
        response = await llm.generate_response(query, metta_context)

        logger.info(f"✅ Query processed: Intent={intent}, Keywords={keywords}")
        return response

    except Exception as e:
        logger.error(f"❌ Query processing failed: {e}")
        return "I'm here to support you. Please share how you're feeling."

async def get_metta_context(query: str, metta_instance) -> Dict:
    """Get MeTTa analysis context for the query"""
    try:
        # This would integrate with the MeTTa engine to get emotional analysis
        # For now, return basic context
        return {
            "primary_emotion": "neutral",
            "intensity": "low",
            "crisis_level": "low",
            "cultural_context": "none"
        }
    except Exception as e:
        logger.error(f"❌ MeTTa context failed: {e}")
        return {}

def format_competition_response(response: str, context: Dict) -> str:
    """
    Format response for competition demonstration
    Following the template structure
    """

    formatted_response = response

    # Add emotional insights if significant
    if context.get('primary_emotion') != 'neutral':
        formatted_response += f"\n\n💭 *Emotional Insight: I sense you're feeling {context.get('primary_emotion')} right now.*"

    # Add crisis resources if needed
    if context.get('crisis_level') == 'emergency':
        formatted_response += "\n\n🚨 *Emergency Resources:*"
        formatted_response += "\n• National Suicide Prevention Lifeline: 988"
        formatted_response += "\n• Crisis Text Line: Text HOME to 741741"

    return formatted_response

if __name__ == "__main__":
    # Test the integration
    async def test_integration():
        print("🧪 Testing Divorce Support RAG + LLM Integration")

        # Initialize components (would normally be done in agent.py)
        from hyperon import MeTTa
        metta = MeTTa()

        # Test basic functionality
        rag = DivorceRAG(metta)
        llm = LLMIntegration()

        # Test crisis query
        crisis_info = rag.query_crisis_support("suicidal")
        print(f"🚨 Crisis resources: {crisis_info}")

        # Test emotional support
        anger_support = rag.query_emotional_support("anger")
        print(f"😠 Anger support: {anger_support}")

        # Test intent classification
        intent, keywords = get_intent_and_keyword("I feel so angry about this divorce", metta)
        print(f"🎯 Intent: {intent}, Keywords: {keywords}")

        print("✅ Integration test completed")

    asyncio.run(test_integration())
