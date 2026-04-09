import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

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

export async function analyzeObject(req, res) {
  try {
    const { text, imageBase64, mimeType } = req.body

    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Provide either text or imageBase64' })
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

    const raw = message.content[0].text.trim()
    // Strip possible markdown code fences
    const jsonStr = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!VALID_MODEL_KEYS.includes(parsed.modelKey)) {
      parsed.modelKey = 'default-box'
    }

    res.json({ modelKey: parsed.modelKey, summary: parsed.summary })
  } catch (err) {
    console.error('analyzeObject error:', err)
    res.status(500).json({ error: 'AI analysis failed', details: err.message })
  }
}
