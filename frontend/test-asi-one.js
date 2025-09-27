// Simple test for ASI One API integration
const fetch = require('node-fetch')

const ASI_API_KEY = 'sk_bd00f508b4e9443a94b6721dbe85c209a3f6480c15ee46e3ae353ed4e7a24a49'
const ASI_ENDPOINT = 'https://api.asi1.ai/v1/chat/completions'

async function testASIOne() {
  console.log('🧪 Testing ASI One API integration...')
  
  try {
    const response = await fetch(ASI_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ASI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'asi1-mini',
        messages: [
          {
            role: 'user',
            content: 'I am going through a difficult divorce and feeling overwhelmed. Can you help me?'
          }
        ]
      })
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    
    console.log('✅ ASI One API Response:')
    console.log('Message:', data.choices[0]?.message?.content)
    console.log('Model:', data.model)
    console.log('Tokens used:', data.usage?.total_tokens)
    
    return true
    
  } catch (error) {
    console.error('❌ ASI One API Test Failed:', error.message)
    return false
  }
}

// Run the test
testASIOne().then(success => {
  if (success) {
    console.log('\n🎉 ASI One integration is working correctly!')
    console.log('Your DiviSafe AI chat is ready to provide emotional support.')
  } else {
    console.log('\n⚠️ ASI One integration needs attention.')
    console.log('Please check your API key and network connection.')
  }
})