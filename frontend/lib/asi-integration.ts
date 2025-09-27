// ASI Integration for DiviSafe Platform
// Integrating with Artificial Super Intelligence Alliance (SingularityNET/Fetch.ai)

export interface EmotionalState {
    primary: 'sad' | 'angry' | 'anxious' | 'hopeful' | 'confused' | 'overwhelmed' | 'relieved'
    intensity: number // 1-10
    context: 'divorce' | 'custody' | 'financial' | 'emotional' | 'legal' | 'recovery'
    riskLevel: 'low' | 'medium' | 'high' | 'crisis'
}

export interface AIResponse {
    message: string
    emotionalSupport: string
    resources: string[]
    nextSteps: string[]
    crisisDetected: boolean
    escalateToHuman: boolean
}

export interface MeTTaKnowledgeBase {
    emotionalPatterns: Map<string, string>
    therapeuticResponses: Map<string, string>
    crisisIndicators: string[]
    culturalContext: Map<string, string>
}

class ASIEmotionalSupport {
    private knowledgeBase: MeTTaKnowledgeBase
    private apiEndpoint: string
    private isInitialized: boolean = false

    constructor() {
        this.apiEndpoint = process.env.NEXT_PUBLIC_ASI_ENDPOINT || 'http://localhost:8080/asi'
        this.knowledgeBase = this.initializeKnowledgeBase()
    }

    private initializeKnowledgeBase(): MeTTaKnowledgeBase {
        return {
            emotionalPatterns: new Map([
                ['divorce anxiety', 'Divorce anxiety is completely normal. Many people experience uncertainty during this transition.'],
                ['custody fears', 'Concerns about custody are natural. Focus on what\'s best for your children and maintain open communication.'],
                ['financial stress', 'Financial concerns during divorce are common. Consider consulting with a financial advisor for guidance.'],
                ['loneliness', 'Feeling lonely after separation is normal. Consider joining support groups or reconnecting with friends.'],
                ['anger management', 'Anger is a natural response to divorce. Learning healthy coping strategies can help you process these feelings.'],
                ['depression signs', 'If you\'re experiencing persistent sadness, please consider speaking with a mental health professional.'],
                ['hope for future', 'It\'s wonderful that you\'re looking toward the future. This shows resilience and strength.'],
                ['co-parenting stress', 'Co-parenting challenges are common. Focus on consistency and putting your children\'s needs first.']
            ]),

            therapeuticResponses: new Map([
                ['sad', 'I understand you\'re feeling sad. This is a natural response to the changes you\'re experiencing. Would you like to talk about what\'s troubling you most?'],
                ['angry', 'I can sense your anger. These feelings are valid during such a difficult time. Let\'s explore some healthy ways to process this emotion.'],
                ['anxious', 'Anxiety about the future is completely understandable. Let\'s work on some grounding techniques that might help you feel more centered.'],
                ['overwhelmed', 'Feeling overwhelmed is common during divorce proceedings. Let\'s break down your concerns into manageable pieces.'],
                ['hopeful', 'I\'m glad to hear you\'re feeling hopeful. This positive outlook can be a powerful tool in your healing journey.'],
                ['confused', 'Confusion during this time is normal. There are many decisions to make. Let\'s talk through what\'s causing the most uncertainty.']
            ]),

            crisisIndicators: [
                'want to hurt myself',
                'thinking about suicide',
                'can\'t go on',
                'want to end it all',
                'no point in living',
                'better off dead',
                'hurt my children',
                'hurt my ex',
                'violent thoughts',
                'can\'t take it anymore'
            ],

            culturalContext: new Map([
                ['indian_family', 'I understand the complexity of Indian family dynamics during divorce. Joint family opinions and social expectations can add extra pressure.'],
                ['religious_concerns', 'Religious and spiritual concerns during divorce are deeply personal. Many find comfort in their faith during difficult transitions.'],
                ['social_stigma', 'Social stigma around divorce can be challenging, especially in traditional communities. Remember that your wellbeing matters most.'],
                ['arranged_marriage', 'Ending an arranged marriage can involve complex family relationships. It\'s important to prioritize your mental health and safety.']
            ])
        }
    }

    async analyzeMessage(message: string, userId: string, roomContext: string): Promise<{
        emotionalState: EmotionalState,
        response: AIResponse
    }> {
        try {
            // Detect emotional state
            const emotionalState = this.detectEmotionalState(message)

            // Check for crisis indicators
            const crisisDetected = this.detectCrisis(message)

            // Generate appropriate response
            const response = await this.generateResponse(emotionalState, message, crisisDetected)

            // Log interaction for learning
            await this.logInteraction(userId, message, emotionalState, response)

            return { emotionalState, response }
        } catch (error) {
            console.error('ASI Analysis Error:', error)
            return this.getFallbackResponse()
        }
    }

    private detectEmotionalState(message: string): EmotionalState {
        const lowerMessage = message.toLowerCase()

        // Detect primary emotion
        let primary: EmotionalState['primary'] = 'confused'
        let intensity = 5
        let context: EmotionalState['context'] = 'emotional'
        let riskLevel: EmotionalState['riskLevel'] = 'low'

        // Emotion detection patterns
        if (lowerMessage.includes('sad') || lowerMessage.includes('cry') || lowerMessage.includes('depressed')) {
            primary = 'sad'
            intensity = 7
        } else if (lowerMessage.includes('angry') || lowerMessage.includes('furious') || lowerMessage.includes('hate')) {
            primary = 'angry'
            intensity = 8
        } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('scared')) {
            primary = 'anxious'
            intensity = 6
        } else if (lowerMessage.includes('hope') || lowerMessage.includes('better') || lowerMessage.includes('positive')) {
            primary = 'hopeful'
            intensity = 4
        } else if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('too much') || lowerMessage.includes('can\'t handle')) {
            primary = 'overwhelmed'
            intensity = 8
        }

        // Context detection
        if (lowerMessage.includes('custody') || lowerMessage.includes('children') || lowerMessage.includes('kids')) {
            context = 'custody'
        } else if (lowerMessage.includes('money') || lowerMessage.includes('financial') || lowerMessage.includes('assets')) {
            context = 'financial'
        } else if (lowerMessage.includes('lawyer') || lowerMessage.includes('court') || lowerMessage.includes('legal')) {
            context = 'legal'
        } else if (lowerMessage.includes('divorce') || lowerMessage.includes('separation')) {
            context = 'divorce'
        }

        // Risk assessment
        if (this.detectCrisis(lowerMessage)) {
            riskLevel = 'crisis'
            intensity = 10
        } else if (intensity >= 8) {
            riskLevel = 'high'
        } else if (intensity >= 6) {
            riskLevel = 'medium'
        }

        return { primary, intensity, context, riskLevel }
    }

    private detectCrisis(message: string): boolean {
        const lowerMessage = message.toLowerCase()
        return this.knowledgeBase.crisisIndicators.some(indicator =>
            lowerMessage.includes(indicator)
        )
    }

    private async generateResponse(
        emotionalState: EmotionalState,
        originalMessage: string,
        crisisDetected: boolean
    ): Promise<AIResponse> {

        if (crisisDetected) {
            return {
                message: "I'm very concerned about what you've shared. Your safety is the top priority right now. Please reach out to a crisis helpline immediately or contact emergency services.",
                emotionalSupport: "You are not alone, and there are people who want to help you through this difficult time.",
                resources: [
                    "National Suicide Prevention Lifeline: 988",
                    "Crisis Text Line: Text HOME to 741741",
                    "Emergency Services: 911"
                ],
                nextSteps: [
                    "Contact a crisis helpline immediately",
                    "Reach out to a trusted friend or family member",
                    "Consider going to the nearest emergency room"
                ],
                crisisDetected: true,
                escalateToHuman: true
            }
        }

        // Get base therapeutic response
        const baseResponse = this.knowledgeBase.therapeuticResponses.get(emotionalState.primary) ||
            "I hear that you're going through a difficult time. Would you like to share more about what you're experiencing?"

        // Generate contextual resources
        const resources = this.getContextualResources(emotionalState.context)

        // Generate next steps
        const nextSteps = this.getNextSteps(emotionalState)

        return {
            message: baseResponse,
            emotionalSupport: this.getEmotionalSupport(emotionalState),
            resources,
            nextSteps,
            crisisDetected: false,
            escalateToHuman: emotionalState.riskLevel === 'high'
        }
    }

    private getEmotionalSupport(emotionalState: EmotionalState): string {
        const supportMessages = {
            sad: "It's okay to feel sad during this transition. Grief is a natural part of the healing process.",
            angry: "Your anger is understandable. Let's channel this energy into positive actions for your future.",
            anxious: "Anxiety about uncertainty is normal. Focus on what you can control today.",
            hopeful: "Your hope is a strength that will carry you through this journey.",
            confused: "Confusion is normal when facing big life changes. Take it one step at a time.",
            overwhelmed: "When everything feels like too much, remember to breathe and take breaks.",
            relieved: "Feeling relief is completely valid, even during difficult times."
        }

        return supportMessages[emotionalState.primary] || "Your feelings are valid and you're not alone in this journey."
    }

    private getContextualResources(context: EmotionalState['context']): string[] {
        const resourceMap = {
            divorce: [
                "Divorce support groups in your area",
                "Online divorce recovery programs",
                "Books: 'Crazy Time' by Abigail Trafford"
            ],
            custody: [
                "Co-parenting apps and tools",
                "Child custody mediation services",
                "Resources for talking to children about divorce"
            ],
            financial: [
                "Financial planning for divorce",
                "Divorce financial advisors",
                "Budgeting tools and apps"
            ],
            legal: [
                "Legal aid societies",
                "Divorce attorney consultations",
                "Self-help legal resources"
            ],
            emotional: [
                "Individual therapy services",
                "Support group directories",
                "Mental health apps and tools"
            ],
            recovery: [
                "Post-divorce recovery programs",
                "New beginnings workshops",
                "Personal growth resources"
            ]
        }

        return resourceMap[context] || resourceMap.emotional
    }

    private getNextSteps(emotionalState: EmotionalState): string[] {
        if (emotionalState.riskLevel === 'high') {
            return [
                "Consider speaking with a mental health professional",
                "Reach out to trusted friends or family",
                "Practice self-care activities today"
            ]
        }

        const stepMap = {
            sad: [
                "Allow yourself to feel these emotions",
                "Consider journaling about your feelings",
                "Engage in gentle self-care activities"
            ],
            angry: [
                "Try physical exercise to release tension",
                "Practice deep breathing exercises",
                "Consider anger management techniques"
            ],
            anxious: [
                "Practice grounding techniques (5-4-3-2-1 method)",
                "Focus on what you can control today",
                "Consider meditation or mindfulness apps"
            ],
            hopeful: [
                "Continue nurturing this positive outlook",
                "Set small, achievable goals",
                "Share your hope with others who might benefit"
            ],
            confused: [
                "Make a list of your main concerns",
                "Prioritize the most urgent decisions",
                "Seek guidance from trusted advisors"
            ],
            overwhelmed: [
                "Break large tasks into smaller steps",
                "Delegate what you can",
                "Schedule regular breaks and self-care"
            ],
            relieved: [
                "Acknowledge this positive feeling",
                "Use this energy to plan next steps",
                "Consider how to maintain this sense of relief"
            ]
        }

        return stepMap[emotionalState.primary] || stepMap.confused
    }

    private async logInteraction(
        userId: string,
        message: string,
        emotionalState: EmotionalState,
        response: AIResponse
    ): Promise<void> {
        try {
            // In a real implementation, this would send to your analytics service
            const interactionLog = {
                userId: userId, // This should be anonymized
                timestamp: new Date().toISOString(),
                emotionalState,
                responseGenerated: true,
                crisisDetected: response.crisisDetected,
                escalated: response.escalateToHuman
            }

            // Log to your backend service for learning and improvement
            console.log('ASI Interaction Logged:', interactionLog)
        } catch (error) {
            console.error('Failed to log interaction:', error)
        }
    }

    private getFallbackResponse(): {
        emotionalState: EmotionalState,
        response: AIResponse
    } {
        return {
            emotionalState: {
                primary: 'confused',
                intensity: 5,
                context: 'emotional',
                riskLevel: 'low'
            },
            response: {
                message: "I'm here to listen and support you. Could you tell me more about what you're going through?",
                emotionalSupport: "You're not alone in this journey. Many people have found strength and healing after difficult times.",
                resources: [
                    "DiviSafe support community",
                    "Professional counselor directory",
                    "Crisis support resources"
                ],
                nextSteps: [
                    "Take a moment to breathe",
                    "Consider what support you need most right now",
                    "Reach out when you're ready to talk more"
                ],
                crisisDetected: false,
                escalateToHuman: false
            }
        }
    }

    // Method to integrate with MeTTa/SingularityNET when available
    async connectToMeTTa(): Promise<boolean> {
        try {
            // This would connect to the actual MeTTa service
            const response = await fetch(`${this.apiEndpoint}/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ platform: 'divisafe' })
            })

            this.isInitialized = response.ok
            return this.isInitialized
        } catch (error) {
            console.error('Failed to connect to MeTTa:', error)
            return false
        }
    }
}

export const asiSupport = new ASIEmotionalSupport()