#!/usr/bin/env python3
"""
Knowledge Graph for Divorce Support MeTTa Agent
Initializes MeTTa knowledge base with divorce support domain knowledge
"""

from hyperon import MeTTa, Atom, Symbol, Expression, GroundedAtom, OperationAtom
from hyperon.ext import register_atoms
import logging

logger = logging.getLogger(__name__)

def initialize_knowledge_graph(metta: MeTTa):
    """
    Initialize MeTTa knowledge graph with comprehensive divorce support knowledge
    Following the competition template structure
    """

    divorce_knowledge = """
    ; ==========================================
    ; Divorce Support MeTTa Knowledge Base
    ; Competition-Ready Implementation
    ; ==========================================

    ; Core emotional state definitions with crisis detection
    (= (emotion anger) (keywords "angry" "furious" "rage" "hate" "unfair" "betrayed" "infuriated"))
    (= (emotion sadness) (keywords "sad" "depressed" "lonely" "empty" "heartbroken" "lost" "grieving"))
    (= (emotion anxiety) (keywords "worried" "scared" "anxious" "nervous" "panic" "afraid" "stressed"))
    (= (emotion guilt) (keywords "guilty" "shame" "my fault" "should have" "regret" "responsible"))
    (= (emotion hope) (keywords "better" "future" "healing" "moving on" "strength" "optimistic"))

    ; Crisis indicators with emergency classification
    (= (crisis suicidal) (keywords "kill myself" "end it all" "better off dead" "no point living" "suicide"))
    (= (crisis self-harm) (keywords "hurt myself" "cutting" "pills" "bridge" "overdose" "harm myself"))
    (= (crisis severe-depression) (keywords "can't go on" "worthless" "no hope" "everyone hates me"))

    ; Cultural context indicators for diverse populations
    (= (culture indian) (keywords "joint family" "arranged marriage" "dowry" "family honor" "social stigma"))
    (= (culture western) (keywords "individual" "personal choice" "dating" "career" "independence"))

    ; Support room classifications
    (= (room crisis-intervention) (category "emergency") (max_users 10) (requires_human true))
    (= (room anger-management) (category "emotional") (max_users 20) (requires_human false))
    (= (room cultural-support) (category "cultural") (max_users 30) (requires_human false))
    (= (room legal-consultation) (category "professional") (max_users 20) (requires_human true))

    ; Intent classification for query routing
    (= (intent crisis-support) (keywords "suicide" "kill myself" "end it all" "hurt myself" "crisis"))
    (= (intent emotional-support) (keywords "sad" "angry" "anxious" "lonely" "depressed" "feelings"))
    (= (intent divorce-guidance) (keywords "divorce" "separation" "custody" "legal" "financial"))
    (= (intent cultural-support) (keywords "joint family" "arranged marriage" "family honor" "culture"))

    ; Response strategies based on emotional state
    (= (strategy validation) (responses "I understand" "That makes sense" "Your feelings are valid"))
    (= (strategy empathy) (responses "I'm sorry you're going through this" "That sounds really difficult"))
    (= (strategy support) (responses "You're not alone" "I'm here for you" "We can work through this"))

    ; Resource recommendations by category
    (= (resource anger-management)
       (articles "Managing Anger During Divorce" "https://www.helpguide.org/articles/relationships-communication/anger-management.htm")
       (audio "Anger Management Meditation" "https://www.mindful.org/mindfulness-meditation-anger/"))

    (= (resource crisis-support)
       (hotlines "National Suicide Prevention Lifeline" "988")
       (hotlines "Crisis Text Line" "741741")
       (emergency "Emergency Services" "911"))

    (= (resource cultural-indian)
       (considerations "family pressure" "social stigma" "community expectations")
       (support "culturally sensitive counseling" "family mediation"))

    ; Therapeutic approaches
    (= (approach crisis-intervention)
       (techniques "safety planning" "immediate support" "resource connection")
       (suitable_for "suicidal" "self-harm" "severe-depression"))

    (= (approach cognitive-behavioral)
       (techniques "thought challenging" "behavioral activation" "problem solving")
       (suitable_for "anger" "anxiety" "guilt"))

    (= (approach supportive)
       (techniques "active listening" "validation" "normalization")
       (suitable_for "sadness" "grief" "hope"))

    ; Progress assessment stages
    (= (stage early-divorce)
       (indicators "intense emotions" "daily distress" "sleep issues")
       (focus "crisis management" "basic coping" "social support"))

    (= (stage middle-divorce)
       (indicators "decreasing intensity" "hope emerging" "new routines")
       (focus "skill building" "relationship exploration" "life planning"))

    (= (stage post-divorce)
       (indicators "emotional stability" "future orientation" "new relationships")
       (focus "growth activities" "giving back" "new beginnings"))

    ; Agent collaboration patterns
    (= (collaborate crisis) (notify "crisis-monitor") (escalate "human-counselor"))
    (= (collaborate emotional) (route "room-matcher") (provide "knowledge-base"))
    (= (collaborate cultural) (specialize "cultural-expert") (resources "community-support"))

    ; Quality metrics for agent responses
    (= (quality empathetic) (score 0.9) (factors "validation" "understanding" "support"))
    (= (quality accurate) (score 0.85) (factors "correct information" "appropriate resources"))
    (= (quality timely) (score 0.8) (factors "quick response" "immediate crisis detection"))

    ; ==========================================
    ; MeTTa Reasoning Rules
    ; ==========================================

    ; Crisis detection rule
    (:= (detect-crisis $message)
        (match &self (crisis $type) (keywords $keywords))
        (any-match &self (in $keyword $keywords) (contains $message $keyword)))

    ; Emotional analysis rule
    (:= (analyze-emotion $message)
        (let $emotions (match &self (emotion $emotion) (keywords $keywords))
             $matches (map (L $emotion $keywords)
                          (count (L $keyword) (and (in $keyword $keywords) (contains $message $keyword)))))
        (max-by &self (L $emotion $count) $count $matches)))

    ; Room recommendation rule
    (:= (recommend-rooms $emotion $culture)
        (let $base-rooms (match &self (room $room) (category $category))
        (case $emotion
              ("anger" (list "anger-management" "general-support"))
              ("sadness" (list "post-divorce-recovery" "emotional-support"))
              ("anxiety" (list "co-parenting-support" "financial-planning"))
              (_ (list "general-support")))))

    ; Resource suggestion rule
    (:= (suggest-resources $emotion $intensity)
        (case $emotion
              ("anger" (match &self (resource anger-management) $resources))
              ("crisis" (match &self (resource crisis-support) $resources))
              (_ (list "General support resources"))))

    ; Cultural adaptation rule
    (:= (adapt-cultural $context $emotion)
        (case $context
              ("indian" (if (in $emotion (list "anger" "guilt"))
                            "Add family considerations and cultural sensitivity"
                            "Focus on individual wellbeing and social support"))
              (_ "Provide general support with cultural awareness")))

    ; Response generation rule
    (:= (generate-response $emotion $intensity $context)
        (let $strategy (match &self (strategy $strat) (responses $responses))
             $approach (match &self (approach $app) (suitable_for $emotion))
             $base-response (nth $responses 0)
             $cultural-adaptation (adapt-cultural $context $emotion))
        (concat $base-response " " $cultural-adaptation)))
    """

    try:
        result = metta.run(divorce_knowledge)
        logger.info("✅ Divorce support knowledge graph initialized successfully")
        logger.info(f"📊 Knowledge graph size: {len(divorce_knowledge.split())} atoms")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to initialize knowledge graph: {e}")
        return False

def query_knowledge_graph(metta: MeTTa, query: str):
    """
    Query the MeTTa knowledge graph
    Following competition template patterns
    """

    try:
        # Parse and execute query
        result = metta.run(query)
        logger.info(f"✅ Knowledge query executed: {query[:50]}...")
        return result
    except Exception as e:
        logger.error(f"❌ Knowledge query failed: {e}")
        return None

def add_dynamic_knowledge(metta: MeTTa, relation: str, subject: str, obj: str):
    """
    Add new knowledge to the MeTTa graph dynamically
    Following the competition example pattern
    """

    try:
        # Create MeTTa expression for new knowledge
        new_knowledge = f'(= ({relation} {subject}) "{obj}")'

        # Add to knowledge graph
        metta.run(new_knowledge)
        logger.info(f"✅ Added dynamic knowledge: {relation}({subject}) = {obj}")
        return True
    except Exception as e:
        logger.error(f"❌ Failed to add dynamic knowledge: {e}")
        return False

def get_intent_and_keyword(query: str, metta: MeTTa):
    """
    Classify user intent and extract keywords using MeTTa
    Following competition template structure
    """

    try:
        # Query for intent classification
        intent_query = f'''
        (let $message "{query.lower()}")
        (match &self (intent $intent_type) (keywords $keywords))
        (let $matches (filter (L $keyword) (contains $message $keyword) $keywords))
        (if (empty $matches)
            "general-support"
            (match &self (intent $intent_type) (keywords $matches) $intent_type)))
        '''

        intent_result = metta.run(intent_query)

        # Extract keywords from query
        keywords = extract_keywords(query)

        logger.info(f"✅ Intent classification: {intent_result}, Keywords: {keywords}")
        return intent_result, keywords

    except Exception as e:
        logger.error(f"❌ Intent classification failed: {e}")
        return "general-support", []

def extract_keywords(text: str) -> List[str]:
    """Extract relevant keywords from user input"""
    # Simple keyword extraction for divorce support context
    divorce_keywords = [
        "divorce", "separation", "custody", "support", "help", "crisis",
        "anger", "sadness", "anxiety", "guilt", "hope", "family", "legal",
        "financial", "emotional", "cultural", "indian", "western"
    ]

    found_keywords = []
    text_lower = text.lower()

    for keyword in divorce_keywords:
        if keyword in text_lower:
            found_keywords.append(keyword)

    return found_keywords

if __name__ == "__main__":
    # Test the knowledge graph
    metta = MeTTa()
    success = initialize_knowledge_graph(metta)

    if success:
        print("✅ Knowledge graph test successful")

        # Test a sample query
        test_query = "What rooms are recommended for anger?"
        intent, keywords = get_intent_and_keyword(test_query, metta)
        print(f"📝 Query: {test_query}")
        print(f"🎯 Intent: {intent}")
        print(f"🔑 Keywords: {keywords}")
    else:
        print("❌ Knowledge graph test failed")
