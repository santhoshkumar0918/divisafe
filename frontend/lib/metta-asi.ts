// Real ASI Integration with SingularityNET MeTTa
// Based on https://github.com/fetchai/innovation-lab-examples/tree/main/web3/singularity-net-metta

import axios from 'axios'

export interface MeTTaRequest {
  query: string
  context: string
  userId: string
  sessionId: string
}

export interface MeTTaResponse {
  result: string
  confidence: number
  emotionalState: EmotionalAnalysis
  recommendations: string[]
  crisisDetected: boolean
  escalateToHuman: boolean
}

export interface EmotionalAnalysis {
  primary_emotion: string
  intensity: number
  valence: number // -1 to 1 (negative to positive)
  arousal: number // 0 to 1 (calm to excited)
  context_understanding: string
  cultural_context: string
  risk_assessment: 'low' | 'medium' | 'high' | 'crisis'
}

export interface MeTTaKnowledgeBase {
  emotional_patterns: Record<string, string>
  therapeutic_responses: Record<string, string>
  crisis_indicators: string[]
  cultural_contexts: Record<string, string>
  coping_strategies: Record<string, string[]>
}

class MeTTaASIService {
  private baseUrl: string
  private apiKey: string
  private isConnected: boolean = false
  private knowledgeBase: MeTTaKnowledgeBase

  constructor() {
    this.baseUrl = process.env.NEXT_PUBLIC_METTA_ENDPOINT || 'http://localhost:8080'
    this.apiKey = process.env.NEXT_PUBLIC_METTA_API_KEY || ''
    this.knowledgeBase = this.initializeKnowledgeBase()
  }

  private initializeKnowledgeBase(): MeTTaKnowledgeBase {
    return {
      emotional_patterns: {
        'divorce_anxiety': 'Experiencing uncertainty and fear about the divorce process and future',
        'custody_concerns': 'Worried about child custody arrangements and impact on children',
        'financial_stress': 'Concerned about financial stability and asset division',
        'loneliness': 'Feeling isolated and disconnected from support systems',
        'anger_resentment': 'Harboring anger towards ex-partner or situation',
        'grief_loss': 'Mourning the end of the relationship and life changes',
        'hope_optimism': 'Looking forward to new beginnings and positive changes',
        'confusion_overwhelm': 'Feeling lost and unable to process all the changes'
      },
      therapeutic_responses: {
        'sad': 'I can sense the sadness in your words. It\'s completely natural to feel this way during such a significant life transition. Grief is a normal part of the healing process.',
        'angry': 'Your anger is understandable and valid. Divorce can bring up intense emotions. Let\'s explore healthy ways to process and channel these feelings.',
        'anxious': 'I hear the anxiety in what you\'re sharing. Uncertainty about the future is one of the most challenging aspects of divorce. Let\'s work on some grounding techniques.',
        'overwhelmed': 'It sounds like you\'re carrying a heavy emotional load right now. When everything feels like too much, it can help to break things down into smaller, manageable pieces.',
        'hopeful': 'I\'m encouraged to hear the hope in your voice. This resilience and optimism will be valuable assets as you navigate this transition.',
        'confused': 'Confusion is so common during divorce proceedings. There are many decisions to make and emotions to process. It\'s okay to take things one step at a time.'
      },
      crisis_indicators: [
        'want to hurt myself',
        'thinking about suicide',
        'can\'t go on anymore',
        'want to end it all',
        'no point in living',
        'better off dead',
        'hurt my children',
        'hurt my ex',
        'violent thoughts',
        'can\'t take it anymore',
        'planning to hurt',
        'suicide plan',
        'ending my life'
      ],
      cultural_contexts: {
        'indian_family': 'Understanding the complexity of joint family dynamics and social expectations in Indian culture during divorce',
        'religious_concerns': 'Addressing spiritual and religious considerations that may impact divorce decisions',
        'social_stigma': 'Navigating societal judgment and cultural stigma around divorce',
        'arranged_marriage': 'Dealing with the unique challenges of ending an arranged marriage',
        'extended_family': 'Managing relationships with extended family members during divorce',
        'cultural_identity': 'Maintaining cultural identity while going through personal transformation'
      },
      coping_strategies: {
        'anxiety': [
          'Practice deep breathing exercises (4-7-8 technique)',
          'Use grounding techniques (5-4-3-2-1 sensory method)',
          'Engage in regular physical exercise',
          'Maintain a consistent sleep schedule',
          'Consider mindfulness meditation'
        ],
        'depression': [
          'Establish a daily routine',
          'Connect with supportive friends and family',
          'Engage in activities you previously enjoyed',
          'Consider professional counseling',
          'Practice self-compassion'
        ],
        'anger': [
          'Use physical outlets like exercise or sports',
          'Practice journaling to express feelings',
          'Learn anger management techniques',
          'Take time-outs when feeling overwhelmed',
          'Consider anger management counseling'
        ],
        'loneliness': [
          'Join support groups or community activities',
          'Reconnect with old friends',
          'Consider volunteering for causes you care about',
          'Explore new hobbies or interests',
          'Use technology to stay connected with loved ones'
        ]
      }
    }
  }

  async connect(): Promise<boolean> {
    try {
      const response = await axios.post(`${this.baseUrl}/api/v1/connect`, {
        service: 'divisafe-emotional-support',
        version: '1.0.0'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      })

      this.isConnected = response.status === 200
      return this.isConnected
    } catch (error) {
      console.error('Failed to connect to MeTTa service:', error)
      this.isConnected = false
      return false
    }
  }

  async analyzeEmotionalState(message: string, context: string): Promise<MeTTaResponse> {
    if (!this.isConnected) {
      await this.connect()
    }

    try {
      // Prepare MeTTa query for emotional analysis
      const mettaQuery = this.buildMeTTaQuery(message, context)
      
      const response = await axios.post(`${this.baseUrl}/api/v1/analyze`, {
        query: mettaQuery,
        context: context,
        language: 'en',
        cultural_context: 'indian_divorce_support'
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      })

      return this.processMeTTaResponse(response.data, message)
    } catch (error) {
      console.error('MeTTa analysis failed:', error)
      return this.getFallbackResponse(message)
    }
  }

  private buildMeTTaQuery(message: string, context: string): string {
    // Build MeTTa query using the AtomSpace syntax
    return `
      (analyze-emotional-state
        (message "${message.replace(/"/g, '\\"')}")
        (context "${context}")
        (domain "divorce-support")
        (cultural-context "indian")
        (detect-crisis true)
        (provide-recommendations true)
      )
    `
  }

  private async processMeTTaResponse(data: any, originalMessage: string): Promise<MeTTaResponse> {
    // Process the MeTTa response and extract emotional analysis
    const emotionalState = this.extractEmotionalState(data)
    const crisisDetected = this.detectCrisis(originalMessage, emotionalState)
    
    return {
      result: data.therapeutic_response || this.generateTherapeuticResponse(emotionalState),
      confidence: data.confidence || 0.8,
      emotionalState: emotionalState,
      recommendations: data.recommendations || this.generateRecommendations(emotionalState),
      crisisDetected: crisisDetected,
      escalateToHuman: crisisDetected || emotionalState.risk_assessment === 'high'
    }
  }

  private extractEmotionalState(data: any): EmotionalAnalysis {
    return {
      primary_emotion: data.primary_emotion || this.detectPrimaryEmotion(data.message || ''),
      intensity: data.intensity || 0.5,
      valence: data.valence || 0,
      arousal: data.arousal || 0.5,
      context_understanding: data.context_understanding || 'divorce-related emotional distress',
      cultural_context: data.cultural_context || 'general',
      risk_assessment: data.risk_assessment || 'low'
    }
  }

  private detectPrimaryEmotion(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    if (lowerMessage.includes('sad') || lowerMessage.includes('cry') || lowerMessage.includes('depressed')) {
      return 'sad'
    } else if (lowerMessage.includes('angry') || lowerMessage.includes('furious') || lowerMessage.includes('hate')) {
      return 'angry'
    } else if (lowerMessage.includes('anxious') || lowerMessage.includes('worried') || lowerMessage.includes('scared')) {
      return 'anxious'
    } else if (lowerMessage.includes('hope') || lowerMessage.includes('better') || lowerMessage.includes('positive')) {
      return 'hopeful'
    } else if (lowerMessage.includes('overwhelmed') || lowerMessage.includes('too much')) {
      return 'overwhelmed'
    } else {
      return 'confused'
    }
  }

  private detectCrisis(message: string, emotionalState: EmotionalAnalysis): boolean {
    const lowerMessage = message.toLowerCase()
    
    // Check for explicit crisis indicators
    const hasCrisisIndicators = this.knowledgeBase.crisis_indicators.some(indicator => 
      lowerMessage.includes(indicator)
    )
    
    // Check for high-risk emotional state
    const highRiskEmotional = emotionalState.intensity > 0.8 && 
                             emotionalState.valence < -0.7 &&
                             emotionalState.risk_assessment === 'crisis'
    
    return hasCrisisIndicators || highRiskEmotional
  }

  private generateTherapeuticResponse(emotionalState: EmotionalAnalysis): string {
    const baseResponse = this.knowledgeBase.therapeutic_responses[emotionalState.primary_emotion] ||
      "I hear that you're going through a difficult time. Your feelings are valid, and you're not alone in this journey."
    
    // Add cultural context if relevant
    if (emotionalState.cultural_context !== 'general') {
      const culturalResponse = this.knowledgeBase.cultural_contexts[emotionalState.cultural_context]
      if (culturalResponse) {
        return `${baseResponse}\n\n${culturalResponse}`
      }
    }
    
    return baseResponse
  }

  private generateRecommendations(emotionalState: EmotionalAnalysis): string[] {
    const strategies = this.knowledgeBase.coping_strategies[emotionalState.primary_emotion] || 
                      this.knowledgeBase.coping_strategies['anxiety']
    
    const recommendations = [...strategies]
    
    // Add crisis resources if high risk
    if (emotionalState.risk_assessment === 'high' || emotionalState.risk_assessment === 'crisis') {
      recommendations.unshift(
        'Consider speaking with a mental health professional immediately',
        'Reach out to a trusted friend or family member',
        'Contact a crisis helpline if you\'re having thoughts of self-harm'
      )
    }
    
    return recommendations
  }

  private getFallbackResponse(message: string): MeTTaResponse {
    const emotion = this.detectPrimaryEmotion(message)
    const crisisDetected = this.knowledgeBase.crisis_indicators.some(indicator => 
      message.toLowerCase().includes(indicator)
    )
    
    return {
      result: this.knowledgeBase.therapeutic_responses[emotion] || 
              "I'm here to listen and support you. Could you tell me more about what you're experiencing?",
      confidence: 0.6,
      emotionalState: {
        primary_emotion: emotion,
        intensity: 0.5,
        valence: 0,
        arousal: 0.5,
        context_understanding: 'divorce-related emotional distress',
        cultural_context: 'general',
        risk_assessment: crisisDetected ? 'crisis' : 'medium'
      },
      recommendations: this.knowledgeBase.coping_strategies[emotion] || [],
      crisisDetected: crisisDetected,
      escalateToHuman: crisisDetected
    }
  }

  async logInteraction(userId: string, message: string, response: MeTTaResponse): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/api/v1/log`, {
        userId: userId, // This should be anonymized
        timestamp: new Date().toISOString(),
        message_hash: this.hashMessage(message), // Don't store actual message
        emotional_state: response.emotionalState,
        crisis_detected: response.crisisDetected,
        escalated: response.escalateToHuman,
        confidence: response.confidence
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      })
    } catch (error) {
      console.error('Failed to log interaction:', error)
    }
  }

  private hashMessage(message: string): string {
    // Simple hash for privacy - in production use proper cryptographic hash
    let hash = 0
    for (let i = 0; i < message.length; i++) {
      const char = message.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return hash.toString(16)
  }

  async getCrisisResources(location: string = 'global'): Promise<string[]> {
    const resources = {
      global: [
        'International Association for Suicide Prevention: https://www.iasp.info/resources/Crisis_Centres/',
        'Crisis Text Line: Text HOME to 741741',
        'Emergency Services: Call your local emergency number'
      ],
      india: [
        'AASRA: +91-9820466726',
        'Sneha India: +91-44-24640050',
        'Vandrevala Foundation: 1860-2662-345',
        'Emergency: 112'
      ],
      us: [
        'National Suicide Prevention Lifeline: 988',
        'Crisis Text Line: Text HOME to 741741',
        'Emergency: 911'
      ],
      eu: [
        'European Emergency Number: 112',
        'Samaritans (UK): 116 123',
        'Crisis helplines vary by country'
      ]
    }
    
    return resources[location as keyof typeof resources] || resources.global
  }
}

export const mettaASI = new MeTTaASIService()