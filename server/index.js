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

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
