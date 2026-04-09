import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { analyzeObject } from './routes/analyzeObject.js'
import { interpretCommand } from './routes/interpretCommand.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json({ limit: '10mb' }))

app.post('/api/analyze-object', analyzeObject)
app.post('/api/interpret-command', interpretCommand)

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

if (process.env.NODE_ENV === 'development') {
  app.get('/api/env-debug', (_req, res) => {
    return res.json({
      ANTHROPIC_API_KEY_SET: Boolean(process.env.ANTHROPIC_API_KEY),
      NODE_ENV: process.env.NODE_ENV,
      PORT: process.env.PORT || 3001,
    })
  })
}

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
