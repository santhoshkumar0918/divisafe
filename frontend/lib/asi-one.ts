// ASI One API Integration with MeTTa Emotional Analysis

export interface ASIMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ASIResponse {
  id: string
  model: string
  choices: Array<{
    index: number
    finish_reason: string
    message: {
      role: string
      content: string
      reasoning?: string
    }
  }>
  usage: {
    prompt_tokens: number
    completion_tokens: number
    total_tokens: number
  }
}

export interface EmotionalAnalysis {
  primary_emotion: string
  intensity: string
  crisis_level: string
  cultural_context: string
  response: string
  room_suggestions: string[]
  resources: any[]
  crisis_alert: boolean
  human_intervention: boolean
  follow_up_questions: string[]
  therapeutic_approach?: string
}

class ASIOneService {
  private apiKey: string
  private endpoint: string
  private mettaEndpoint: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ASI_ONE_API_KEY || ''
    this.endpoint = process.env.NEXT_PUBLIC_ASI_ONE_ENDPOINT || 'https://api.asi1.ai/v1/chat/completions'
    this.mettaEndpoint = process.env.NEXT_PUBLIC_METTA_API_URL || 'http://localhost:8006/api/chat/analyze'
  }

  async sendMessage(messages: ASIMessage[]): Promise<string> {
    try {
      const response = await fetch(this.endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'asi1-mini',
          messages: messages
        })
      })

      if (!response.ok) {
        throw new Error(`ASI API error: ${response.status}`)
      }

      const data: ASIResponse = await response.json()
      return data.choices[0]?.message?.content || 'Sorry, I could not process your message.'
      
    } catch (error) {
      console.error('ASI One API Error:', error)
      return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
    }
  }

  async getEmotionalSupport(userMessage: string): Promise<string> {
    try {
      // First, get MeTTa emotional analysis
      const mettaAnalysis = await this.getMeTTaAnalysis(userMessage)

      // If crisis detected, return crisis response immediately
      if (mettaAnalysis.crisis_alert) {
        return this.formatCrisisResponse(mettaAnalysis)
      }

      // Otherwise, use MeTTa analysis to enhance the ASI response
      const enhancedPrompt = this.createEnhancedPrompt(userMessage, mettaAnalysis)

      const systemPrompt = {
        role: 'assistant' as const,
        content: enhancedPrompt
      }

      const messages: ASIMessage[] = [
        systemPrompt,
        { role: 'user', content: userMessage }
      ]

      const asiResponse = await this.sendMessage(messages)

      // Combine MeTTa insights with ASI response
      return this.combineResponses(asiResponse, mettaAnalysis)

    } catch (error) {
      console.error('Enhanced emotional support error:', error)
      return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.'
    }
  }

  private async getMeTTaAnalysis(userMessage: string): Promise<EmotionalAnalysis> {
    try {
      const response = await fetch(this.mettaEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: userMessage,
          user_context: {
            session_id: `session_${Date.now()}`
          }
        })
      })

      if (!response.ok) {
        throw new Error(`MeTTa API error: ${response.status}`)
      }

      const data = await response.json()
      return {
        primary_emotion: data.emotional_state?.primary_emotion || 'neutral',
        intensity: data.emotional_state?.intensity || 'low',
        crisis_level: data.emotional_state?.crisis_level || 'low',
        cultural_context: data.emotional_state?.cultural_context || '',
        response: data.response || '',
        room_suggestions: data.room_suggestions || [],
        resources: data.resources || [],
        crisis_alert: data.crisis_alert || false,
        human_intervention: data.human_intervention || false,
        follow_up_questions: data.follow_up_questions || []
      }
    } catch (error) {
      console.error('MeTTa analysis error:', error)
      // Return default analysis if MeTTa fails
      return {
        primary_emotion: 'neutral',
        intensity: 'low',
        crisis_level: 'low',
        cultural_context: '',
        response: '',
        room_suggestions: [],
        resources: [],
        crisis_alert: false,
        human_intervention: false,
        follow_up_questions: []
      }
    }
  }

  private createEnhancedPrompt(userMessage: string, analysis: EmotionalAnalysis): string {
    return `You are an AI emotional support companion for people going through divorce. You provide empathetic, supportive responses while being mindful of:

1. Emotional validation and understanding
2. Crisis detection (if someone mentions self-harm, provide crisis resources)
3. Practical divorce-related guidance
4. Cultural sensitivity
5. Encouraging professional help when needed

IMPORTANT EMOTIONAL CONTEXT:
- Primary emotion detected: ${analysis.primary_emotion}
- Emotional intensity: ${analysis.intensity}
- Crisis level: ${analysis.crisis_level}
- Cultural context: ${analysis.cultural_context || 'Not detected'}

RECOMMENDED APPROACH:
- Use ${analysis.therapeutic_approach || 'supportive'} therapeutic approach
- Suggested rooms: ${analysis.room_suggestions.join(', ')}
- Follow-up questions: ${analysis.follow_up_questions.slice(0, 2).join(', ')}

RESOURCES TO CONSIDER:
${analysis.resources.slice(0, 2).map(r => `- ${r.title || r.name}: ${r.url || r.phone || 'Contact information available'}`).join('\n')}

Keep responses warm, supportive, and helpful. Adapt your tone to the detected emotional state and provide relevant resources when appropriate.`
  }

  private formatCrisisResponse(analysis: EmotionalAnalysis): string {
    let response = analysis.response

    if (analysis.resources && analysis.resources.length > 0) {
      response += '\n\n🚨 EMERGENCY RESOURCES:\n'
      analysis.resources.forEach(resource => {
        if (resource.type === 'hotline' || resource.type === 'emergency') {
          response += `• ${resource.title}: ${resource.contact || resource.phone}
`
        }
      })
    }

    if (analysis.human_intervention) {
      response += '\n\n👥 A human counselor will be joining this conversation shortly to provide additional support.'
    }

    return response
  }

  private combineResponses(asiResponse: string, analysis: EmotionalAnalysis): string {
    let enhancedResponse = asiResponse

    // Add emotional insights if significant
    if (analysis.primary_emotion !== 'neutral' && analysis.intensity !== 'low') {
      enhancedResponse += `\n\n💭 *Emotional Insight: I sense you're feeling ${analysis.primary_emotion} right now. Your feelings are completely valid.*`
    }

    // Add follow-up questions if available
    if (analysis.follow_up_questions && analysis.follow_up_questions.length > 0) {
      enhancedResponse += `\n\n❓ ${analysis.follow_up_questions[0]}`
    }

    // Add room suggestions if relevant
    if (analysis.room_suggestions && analysis.room_suggestions.length > 0) {
      enhancedResponse += `\n\n🏠 *You might also find support in: ${analysis.room_suggestions.slice(0, 2).join(', ')}*`
    }

    return enhancedResponse
  }
}

export const asiOne = new ASIOneService()