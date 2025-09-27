// ASI One API Integration
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

class ASIOneService {
  private apiKey: string
  private endpoint: string

  constructor() {
    this.apiKey = process.env.NEXT_PUBLIC_ASI_ONE_API_KEY || ''
    this.endpoint = process.env.NEXT_PUBLIC_ASI_ONE_ENDPOINT || 'https://api.asi1.ai/v1/chat/completions'
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
    const systemPrompt = {
      role: 'assistant' as const,
      content: `You are an AI emotional support companion for people going through divorce. You provide empathetic, supportive responses while being mindful of:

1. Emotional validation and understanding
2. Crisis detection (if someone mentions self-harm, provide crisis resources)
3. Practical divorce-related guidance
4. Cultural sensitivity
5. Encouraging professional help when needed

Keep responses warm, supportive, and helpful. If you detect any crisis indicators, immediately provide crisis hotline numbers.`
    }

    const messages: ASIMessage[] = [
      systemPrompt,
      { role: 'user', content: userMessage }
    ]

    return await this.sendMessage(messages)
  }
}

export const asiOne = new ASIOneService()