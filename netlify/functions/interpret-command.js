import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const VALID_ANIMATIONS = [
  'idle',
  'wave',
  'point',
  'walk',
  'safety-posture',
  'crouch',
  'thumbs-up',
  'look-around',
]

export async function handler(event) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY in environment' }),
      }
    }

    const { command } = JSON.parse(event.body || '{}')

    if (!command || typeof command !== 'string') {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Provide a command string' }),
      }
    }

    const prompt = `You are an AI animation controller for a 3D safety training avatar.
Map this command to the best matching animation: "${command}"

Available animations: ${VALID_ANIMATIONS.join(', ')}

Respond ONLY with valid JSON (no markdown, no explanation):
{"animationKey":"<animation>","explanation":"<explanation>"}

animationKey must be exactly one of the available animations listed above.
explanation must be 1-2 sentences describing what the avatar is doing and why it is relevant to safety training.`

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = (() => {
      if (typeof message?.content === 'string') return message.content.trim()
      if (Array.isArray(message?.content) && message.content[0]?.text) return message.content[0].text.trim()
      throw new Error(`Unexpected Anthropic response shape: ${JSON.stringify(message)}`)
    })()
    const jsonStr = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!VALID_ANIMATIONS.includes(parsed.animationKey)) {
      parsed.animationKey = 'idle'
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ animationKey: parsed.animationKey, explanation: parsed.explanation }),
    }
  } catch (error) {
    console.error('interpret-command error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI interpretation failed', details: error.message }),
    }
  }
}
