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

export async function interpretCommand(req, res) {
  try {
    const { command } = req.body

    if (!command || typeof command !== 'string') {
      return res.status(400).json({ error: 'Provide a command string' })
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

    const raw = message.content[0].text.trim()
    const jsonStr = raw.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim()
    const parsed = JSON.parse(jsonStr)

    if (!VALID_ANIMATIONS.includes(parsed.animationKey)) {
      parsed.animationKey = 'idle'
    }

    res.json({ animationKey: parsed.animationKey, explanation: parsed.explanation })
  } catch (err) {
    console.error('interpretCommand error:', err)
    res.status(500).json({ error: 'AI interpretation failed', details: err.message })
  }
}
