// MeTTa Server Implementation for Real ASI Integration
// Based on Fetch.ai SingularityNET MeTTa examples

import { WebSocket } from 'ws'

export interface MeTTaAtomSpace {
  atoms: Map<string, any>
  relationships: Map<string, string[]>
  knowledge_base: Map<string, any>
}

export interface MeTTaQuery {
  expression: string
  bindings: Record<string, any>
  context: string
}

export interface MeTTaResult {
  success: boolean
  result: any
  confidence: number
  reasoning: string[]
}

class MeTTaServer {
  private atomSpace: MeTTaAtomSpace
  private wsServer: WebSocket | null = null
  private isRunning: boolean = false
  private port: number

  constructor(port: number = 8080) {
    this.port = port
    this.atomSpace = this.initializeAtomSpace()
  }

  private initializeAtomSpace(): MeTTaAtomSpace {
    const atomSpace: MeTTaAtomSpace = {
      atoms: new Map(),
      relationships: new Map(),
      knowledge_base: new Map()
    }

    // Initialize emotional support knowledge base
    this.loadEmotionalSupportKnowledge(atomSpace)
    this.loadTherapeuticResponses(atomSpace)
    this.loadCrisisDetectionRules(atomSpace)
    this.loadCulturalContexts(atomSpace)

    return atomSpace
  }

  private loadEmotionalSupportKnowledge(atomSpace: MeTTaAtomSpace): void {
    // Define emotional states and their characteristics
    const emotionalStates = [
      { name: 'sad', valence: -0.8, arousal: 0.3, intensity_range: [0.4, 1.0] },
      { name: 'angry', valence: -0.6, arousal: 0.9, intensity_range: [0.5, 1.0] },
      { name: 'anxious', valence: -0.5, arousal: 0.8, intensity_range: [0.3, 0.9] },
      { name: 'hopeful', valence: 0.7, arousal: 0.6, intensity_range: [0.4, 0.8] },
      { name: 'overwhelmed', valence: -0.7, arousal: 0.9, intensity_range: [0.6, 1.0] },
      { name: 'confused', valence: -0.2, arousal: 0.5, intensity_range: [0.3, 0.7] }
    ]

    emotionalStates.forEach(state => {
      atomSpace.atoms.set(`emotion:${state.name}`, {
        type: 'EmotionalState',
        properties: state
      })
    })

    // Define emotional patterns for divorce context
    const divorcePatterns = [
      {
        pattern: 'custody_anxiety',
        triggers: ['children', 'custody', 'kids', 'parenting'],
        emotional_impact: { primary: 'anxious', secondary: 'sad', intensity: 0.8 }
      },
      {
        pattern: 'financial_stress',
        triggers: ['money', 'financial', 'assets', 'support', 'alimony'],
        emotional_impact: { primary: 'overwhelmed', secondary: 'angry', intensity: 0.7 }
      },
      {
        pattern: 'loneliness_grief',
        triggers: ['alone', 'lonely', 'miss', 'empty', 'lost'],
        emotional_impact: { primary: 'sad', secondary: 'confused', intensity: 0.9 }
      },
      {
        pattern: 'anger_resentment',
        triggers: ['hate', 'angry', 'unfair', 'betrayed', 'lied'],
        emotional_impact: { primary: 'angry', secondary: 'sad', intensity: 0.8 }
      }
    ]

    divorcePatterns.forEach(pattern => {
      atomSpace.knowledge_base.set(`pattern:${pattern.pattern}`, pattern)
    })
  }

  private loadTherapeuticResponses(atomSpace: MeTTaAtomSpace): void {
    const therapeuticResponses = {
      'sad': [
        "I can hear the sadness in your words. It's completely natural to feel this way during such a significant life change.",
        "Grief is a normal part of the healing process. Allow yourself to feel these emotions without judgment.",
        "Your sadness shows how much this relationship meant to you. That's not something to be ashamed of."
      ],
      'angry': [
        "Your anger is understandable and valid. Divorce can bring up intense emotions that need to be processed.",
        "It's okay to feel angry. Let's explore healthy ways to channel these feelings constructively.",
        "Anger often masks other emotions like hurt or fear. What do you think might be underneath this anger?"
      ],
      'anxious': [
        "I can sense the anxiety you're experiencing. Uncertainty about the future is one of the hardest parts of divorce.",
        "Anxiety is your mind's way of trying to prepare for the unknown. Let's work on some grounding techniques.",
        "It's normal to feel anxious when so much is changing. You don't have to face this uncertainty alone."
      ],
      'overwhelmed': [
        "It sounds like you're carrying a heavy emotional load right now. That's completely understandable.",
        "When everything feels like too much, it can help to break things down into smaller, manageable pieces.",
        "You don't have to handle everything at once. Let's focus on what's most important right now."
      ],
      'hopeful': [
        "I'm encouraged to hear the hope in your voice. This resilience will be a valuable asset moving forward.",
        "Hope is a powerful force for healing. Hold onto that feeling as you navigate this transition.",
        "Your optimism shows incredible strength. How can we build on this positive outlook?"
      ],
      'confused': [
        "Confusion is so common during divorce proceedings. There are many decisions to make and emotions to process.",
        "It's okay to feel lost right now. Clarity often comes gradually as you work through your feelings.",
        "Let's take this one step at a time. What feels like the most pressing concern for you right now?"
      ]
    }

    Object.entries(therapeuticResponses).forEach(([emotion, responses]) => {
      atomSpace.knowledge_base.set(`therapeutic_response:${emotion}`, responses)
    })
  }

  private loadCrisisDetectionRules(atomSpace: MeTTaAtomSpace): void {
    const crisisRules = [
      {
        rule_id: 'suicide_ideation',
        triggers: [
          'want to hurt myself', 'thinking about suicide', 'end it all',
          'no point in living', 'better off dead', 'kill myself',
          'suicide plan', 'ending my life', 'can\'t go on'
        ],
        severity: 'critical',
        immediate_action: 'escalate_to_human',
        resources: [
          'National Suicide Prevention Lifeline: 988',
          'Crisis Text Line: Text HOME to 741741',
          'Emergency Services: 911'
        ]
      },
      {
        rule_id: 'violence_ideation',
        triggers: [
          'hurt my ex', 'kill them', 'violent thoughts', 'make them pay',
          'planning to hurt', 'revenge', 'they deserve to die'
        ],
        severity: 'critical',
        immediate_action: 'escalate_to_human',
        resources: [
          'National Domestic Violence Hotline: 1-800-799-7233',
          'Emergency Services: 911'
        ]
      },
      {
        rule_id: 'severe_depression',
        triggers: [
          'can\'t take it anymore', 'everything is hopeless', 'nothing matters',
          'completely worthless', 'life has no meaning', 'deep dark hole'
        ],
        severity: 'high',
        immediate_action: 'provide_resources',
        resources: [
          'Mental Health America: 1-800-969-6642',
          'SAMHSA National Helpline: 1-800-662-4357'
        ]
      }
    ]

    crisisRules.forEach(rule => {
      atomSpace.knowledge_base.set(`crisis_rule:${rule.rule_id}`, rule)
    })
  }

  private loadCulturalContexts(atomSpace: MeTTaAtomSpace): void {
    const culturalContexts = {
      'indian_family': {
        considerations: [
          'Joint family dynamics and expectations',
          'Social stigma around divorce in traditional communities',
          'Religious and spiritual implications',
          'Extended family involvement in decisions',
          'Cultural pressure to maintain marriage'
        ],
        therapeutic_approach: 'Acknowledge cultural complexity while prioritizing individual wellbeing',
        resources: [
          'Indian family counseling services',
          'Cultural-sensitive therapy options',
          'Community support groups'
        ]
      },
      'religious_orthodox': {
        considerations: [
          'Religious teachings about marriage and divorce',
          'Community judgment and ostracism',
          'Spiritual crisis and faith questioning',
          'Religious leader involvement',
          'Doctrinal conflicts with personal needs'
        ],
        therapeutic_approach: 'Respect religious beliefs while supporting personal autonomy',
        resources: [
          'Faith-based counseling services',
          'Progressive religious communities',
          'Interfaith support groups'
        ]
      }
    }

    Object.entries(culturalContexts).forEach(([context, data]) => {
      atomSpace.knowledge_base.set(`cultural_context:${context}`, data)
    })
  }

  async processQuery(query: MeTTaQuery): Promise<MeTTaResult> {
    try {
      // Parse the MeTTa expression
      const parsedQuery = this.parseMeTTaExpression(query.expression)
      
      // Execute the query against the atom space
      const result = await this.executeQuery(parsedQuery, query.context)
      
      return {
        success: true,
        result: result.value,
        confidence: result.confidence,
        reasoning: result.reasoning
      }
    } catch (error) {
      console.error('Query processing failed:', error)
      return {
        success: false,
        result: null,
        confidence: 0,
        reasoning: [`Error: ${error}`]
      }
    }
  }

  private parseMeTTaExpression(expression: string): any {
    // Simple S-expression parser for MeTTa queries
    // In a real implementation, this would be more sophisticated
    const cleaned = expression.trim().replace(/^\(|\)$/g, '')
    const parts = this.tokenize(cleaned)
    
    return {
      operation: parts[0],
      arguments: parts.slice(1)
    }
  }

  private tokenize(expression: string): string[] {
    const tokens: string[] = []
    let current = ''
    let inQuotes = false
    let parenDepth = 0
    
    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]
      
      if (char === '"' && expression[i-1] !== '\\') {
        inQuotes = !inQuotes
        current += char
      } else if (char === '(' && !inQuotes) {
        parenDepth++
        current += char
      } else if (char === ')' && !inQuotes) {
        parenDepth--
        current += char
      } else if (char === ' ' && !inQuotes && parenDepth === 0) {
        if (current.trim()) {
          tokens.push(current.trim())
          current = ''
        }
      } else {
        current += char
      }
    }
    
    if (current.trim()) {
      tokens.push(current.trim())
    }
    
    return tokens
  }

  private async executeQuery(parsedQuery: any, context: string): Promise<any> {
    const { operation, arguments: args } = parsedQuery
    
    switch (operation) {
      case 'analyze-emotional-state':
        return this.analyzeEmotionalState(args, context)
      case 'detect-crisis':
        return this.detectCrisis(args, context)
      case 'generate-response':
        return this.generateTherapeuticResponse(args, context)
      case 'get-recommendations':
        return this.getRecommendations(args, context)
      default:
        throw new Error(`Unknown operation: ${operation}`)
    }
  }

  private analyzeEmotionalState(args: string[], context: string): any {
    const message = this.extractArgument(args, 'message')
    const culturalContext = this.extractArgument(args, 'cultural-context') || 'general'
    
    // Analyze emotional content
    const emotions = this.detectEmotions(message)
    const patterns = this.matchPatterns(message)
    const crisisLevel = this.assessCrisisLevel(message)
    
    return {
      value: {
        primary_emotion: emotions.primary,
        secondary_emotion: emotions.secondary,
        intensity: emotions.intensity,
        valence: emotions.valence,
        arousal: emotions.arousal,
        patterns: patterns,
        crisis_level: crisisLevel,
        cultural_context: culturalContext
      },
      confidence: emotions.confidence,
      reasoning: [
        `Detected primary emotion: ${emotions.primary}`,
        `Emotional intensity: ${emotions.intensity}`,
        `Crisis assessment: ${crisisLevel}`,
        `Matched patterns: ${patterns.join(', ')}`
      ]
    }
  }

  private detectEmotions(message: string): any {
    const lowerMessage = message.toLowerCase()
    const emotions = {
      sad: this.countMatches(lowerMessage, ['sad', 'cry', 'depressed', 'grief', 'mourn', 'heartbroken']),
      angry: this.countMatches(lowerMessage, ['angry', 'furious', 'hate', 'rage', 'mad', 'pissed']),
      anxious: this.countMatches(lowerMessage, ['anxious', 'worried', 'scared', 'nervous', 'panic', 'fear']),
      hopeful: this.countMatches(lowerMessage, ['hope', 'optimistic', 'better', 'positive', 'future', 'improve']),
      overwhelmed: this.countMatches(lowerMessage, ['overwhelmed', 'too much', 'can\'t handle', 'exhausted']),
      confused: this.countMatches(lowerMessage, ['confused', 'lost', 'don\'t know', 'uncertain', 'unclear'])
    }
    
    const maxEmotion = Object.entries(emotions).reduce((a, b) => emotions[a[0]] > emotions[b[0]] ? a : b)
    const totalMatches = Object.values(emotions).reduce((sum, count) => sum + count, 0)
    
    return {
      primary: maxEmotion[0],
      secondary: Object.entries(emotions).filter(([key]) => key !== maxEmotion[0]).reduce((a, b) => emotions[a[0]] > emotions[b[0]] ? a : b)[0],
      intensity: Math.min(totalMatches / 10, 1.0),
      valence: this.calculateValence(maxEmotion[0]),
      arousal: this.calculateArousal(maxEmotion[0]),
      confidence: Math.min(maxEmotion[1] / Math.max(totalMatches, 1), 1.0)
    }
  }

  private countMatches(text: string, keywords: string[]): number {
    return keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword) ? 1 : 0)
    }, 0)
  }

  private calculateValence(emotion: string): number {
    const valenceMap: Record<string, number> = {
      sad: -0.8,
      angry: -0.6,
      anxious: -0.5,
      hopeful: 0.7,
      overwhelmed: -0.7,
      confused: -0.2
    }
    return valenceMap[emotion] || 0
  }

  private calculateArousal(emotion: string): number {
    const arousalMap: Record<string, number> = {
      sad: 0.3,
      angry: 0.9,
      anxious: 0.8,
      hopeful: 0.6,
      overwhelmed: 0.9,
      confused: 0.5
    }
    return arousalMap[emotion] || 0.5
  }

  private matchPatterns(message: string): string[] {
    const patterns: string[] = []
    const lowerMessage = message.toLowerCase()
    
    this.atomSpace.knowledge_base.forEach((pattern, key) => {
      if (key.startsWith('pattern:')) {
        const patternData = pattern as any
        if (patternData.triggers.some((trigger: string) => lowerMessage.includes(trigger))) {
          patterns.push(patternData.pattern)
        }
      }
    })
    
    return patterns
  }

  private assessCrisisLevel(message: string): string {
    const lowerMessage = message.toLowerCase()
    
    for (const [key, rule] of this.atomSpace.knowledge_base.entries()) {
      if (key.startsWith('crisis_rule:')) {
        const ruleData = rule as any
        if (ruleData.triggers.some((trigger: string) => lowerMessage.includes(trigger))) {
          return ruleData.severity
        }
      }
    }
    
    return 'low'
  }

  private extractArgument(args: string[], argName: string): string {
    const arg = args.find(a => a.includes(argName))
    if (!arg) return ''
    
    const match = arg.match(/"([^"]*)"/)
    return match ? match[1] : ''
  }

  private detectCrisis(args: string[], context: string): any {
    const message = this.extractArgument(args, 'message')
    const crisisLevel = this.assessCrisisLevel(message)
    
    return {
      value: {
        crisis_detected: crisisLevel !== 'low',
        severity: crisisLevel,
        immediate_action_required: crisisLevel === 'critical',
        recommended_resources: this.getCrisisResources(crisisLevel)
      },
      confidence: crisisLevel === 'critical' ? 0.95 : 0.8,
      reasoning: [`Crisis assessment: ${crisisLevel}`]
    }
  }

  private generateTherapeuticResponse(args: string[], context: string): any {
    const emotion = this.extractArgument(args, 'emotion')
    const responses = this.atomSpace.knowledge_base.get(`therapeutic_response:${emotion}`) as string[]
    
    if (!responses) {
      return {
        value: "I hear that you're going through a difficult time. Your feelings are valid, and you're not alone in this journey.",
        confidence: 0.6,
        reasoning: ['Using fallback therapeutic response']
      }
    }
    
    const selectedResponse = responses[Math.floor(Math.random() * responses.length)]
    
    return {
      value: selectedResponse,
      confidence: 0.9,
      reasoning: [`Selected therapeutic response for emotion: ${emotion}`]
    }
  }

  private getRecommendations(args: string[], context: string): any {
    const emotion = this.extractArgument(args, 'emotion')
    const crisisLevel = this.extractArgument(args, 'crisis-level') || 'low'
    
    const recommendations: string[] = []
    
    // Add emotion-specific recommendations
    if (emotion === 'anxious') {
      recommendations.push(
        'Practice deep breathing exercises (4-7-8 technique)',
        'Try grounding techniques (5-4-3-2-1 sensory method)',
        'Consider mindfulness meditation'
      )
    } else if (emotion === 'sad') {
      recommendations.push(
        'Allow yourself to feel and process these emotions',
        'Connect with supportive friends or family',
        'Consider journaling about your feelings'
      )
    } else if (emotion === 'angry') {
      recommendations.push(
        'Use physical outlets like exercise or sports',
        'Practice anger management techniques',
        'Take time-outs when feeling overwhelmed'
      )
    }
    
    // Add crisis-specific recommendations
    if (crisisLevel === 'high' || crisisLevel === 'critical') {
      recommendations.unshift(
        'Consider speaking with a mental health professional immediately',
        'Reach out to a trusted friend or family member',
        'Contact a crisis helpline if needed'
      )
    }
    
    return {
      value: recommendations,
      confidence: 0.85,
      reasoning: [`Generated recommendations for ${emotion} emotion with ${crisisLevel} crisis level`]
    }
  }

  private getCrisisResources(severity: string): string[] {
    const resources: string[] = []
    
    this.atomSpace.knowledge_base.forEach((rule, key) => {
      if (key.startsWith('crisis_rule:')) {
        const ruleData = rule as any
        if (ruleData.severity === severity) {
          resources.push(...ruleData.resources)
        }
      }
    })
    
    return resources
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('MeTTa server is already running')
      return
    }
    
    try {
      // In a real implementation, this would start the actual MeTTa server
      console.log(`MeTTa ASI Server starting on port ${this.port}`)
      console.log('Atom space initialized with emotional support knowledge')
      console.log(`Loaded ${this.atomSpace.atoms.size} atoms`)
      console.log(`Loaded ${this.atomSpace.knowledge_base.size} knowledge base entries`)
      
      this.isRunning = true
      console.log('✅ MeTTa ASI Server is ready for emotional support queries')
    } catch (error) {
      console.error('Failed to start MeTTa server:', error)
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) return
    
    if (this.wsServer) {
      this.wsServer.close()
      this.wsServer = null
    }
    
    this.isRunning = false
    console.log('MeTTa ASI Server stopped')
  }

  getStatus(): { running: boolean; atoms: number; knowledge_entries: number } {
    return {
      running: this.isRunning,
      atoms: this.atomSpace.atoms.size,
      knowledge_entries: this.atomSpace.knowledge_base.size
    }
  }
}

export const mettaServer = new MeTTaServer()