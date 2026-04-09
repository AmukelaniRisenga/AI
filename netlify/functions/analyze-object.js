import Anthropic from '@anthropic-ai/sdk'

const VALID_MODEL_KEYS = [
  'hard-hat',
  'fire-extinguisher',
  'wrench',
  'hammer',
  'safety-vest',
  'drill',
  'screwdriver',
  'first-aid-kit',
  'helmet',
  'default-box',
]

export async function handler(event) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: 'Missing ANTHROPIC_API_KEY in environment' }),
      }
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const body = JSON.parse(event.body || '{}')
    const { text, imageBase64, mimeType } = body

    if (!text && !imageBase64) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Provide either text or imageBase64' }),
      }
    }

    let content

    if (imageBase64) {
      content = [
        {
          type: 'image',
          source: {
            type: 'base64',
            media_type: mimeType || 'image/jpeg',
            data: imageBase64,
          },
        },
        {
          type: 'text',
          text: `You are an AI that identifies safety training objects for workplace education.
Identify the object in this image and respond ONLY with valid JSON (no markdown, no explanation):
{"modelKey":"<key>","summary":"<summary>"}

modelKey must be exactly one of: ${VALID_MODEL_KEYS.join(', ')}
summary must be 2-3 sentences about this object's use in workplace safety training.
If unsure, use "default-box".`,
        },
      ]
    } else {
      content = `You are an AI that identifies safety training objects for workplace education.
Given this description: "${text}"
Respond ONLY with valid JSON (no markdown, no explanation):
{"modelKey":"<key>","summary":"<summary>"}

modelKey must be exactly one of: ${VALID_MODEL_KEYS.join(', ')}
summary must be 2-3 sentences about this object's use in workplace safety training.
If unsure, use "default-box".`
    }

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 512,
      messages: [{ role: 'user', content }],
    })

    const raw = (() => {
      if (typeof message?.content === 'string') return message.content.trim()
      if (Array.isArray(message?.content) && message.content[0]?.text) return message.content[0].text.trim()
      throw new Error(`Unexpected Anthropic response shape: ${JSON.stringify(message)}`)
    })()
    const jsonStr = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!VALID_MODEL_KEYS.includes(parsed.modelKey)) {
      parsed.modelKey = 'default-box'
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ modelKey: parsed.modelKey, summary: parsed.summary }),
    }
  } catch (error) {
    console.error('analyze-object error:', error)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'AI analysis failed', details: error.message }),
    }
  }
}
