# AI-Powered Interactive Prototypes

Two AI-driven interactive prototypes built for the NexEra AI Engineering Challenge.

## What This Builds

### Prototype 1 — AI-Generated 3D Asset Pipeline (`/prototype1`)

Type a description (e.g. "a yellow hard hat") or upload an image → Claude Vision identifies the object → a distinct 3D model renders in a Three.js viewer → an AI-generated educational safety summary appears.

**How it works:**
- Text or base64 image → `POST /api/analyze-object` → Claude Sonnet 4.6
- Claude returns a `modelKey` (one of 10 safety objects) + a 2–3 sentence educational summary
- The frontend attempts to load `/models/{key}.glb`; if absent it renders a rich procedural Three.js model specific to that key (hard hat = yellow dome + brim, fire extinguisher = red cylinder + nozzle, etc.)
- OrbitControls let you rotate, zoom, and pan the model

### Prototype 2 — Natural Language → Avatar Animation (`/prototype2`)

Type a plain-English command (e.g. "wave hello to the learner") → Claude maps it to an animation → a 3D avatar performs the animation with real skeletal-style motion.

**How it works:**
- Command → `POST /api/interpret-command` → Claude Sonnet 4.6
- Claude returns an `animationKey` (idle, wave, point, walk, safety-posture, crouch, thumbs-up, look-around) + an explanation
- The avatar performs time-based procedural animations: walk cycle with leg/arm alternation, wave with oscillating arm, look-around with head sweep, etc.
- Attempts to load a real GLB avatar from `/avatar/character.glb`; falls back to an animated procedural humanoid

---

## Architecture

```
Quasar (Vue 3 + Vite) SPA
├── src/pages/          — Prototype1Page, Prototype2Page
├── src/components/
│   ├── proto1/         — ModelViewer, ModelInputPanel, ModelInfoCard
│   └── proto2/         — AvatarViewer, CommandInputPanel, AnimationInfoCard
├── src/composables/
│   ├── useThreeScene.js        — WebGL renderer, camera, lighting, resize
│   ├── useModelLoader.js       — GLTFLoader with auto-scale/center
│   ├── useProceduralModels.js  — 10 distinct procedural 3D models
│   └── useAnimationMixer.js    — Three.js AnimationMixer wrapper
├── src/stores/
│   ├── model-store.js          — Pinia store for Prototype 1 state
│   └── avatar-store.js         — Pinia store for Prototype 2 state
└── src/services/
    ├── modelService.js         — API client for analyze-object
    └── avatarService.js        — API client for interpret-command

Express Server (local dev, port 3001)
├── server/routes/analyzeObject.js     — Claude Vision → modelKey + summary
└── server/routes/interpretCommand.js  — Claude NL → animationKey + explanation

Netlify Functions (production)
├── netlify/functions/analyze-object.js
└── netlify/functions/interpret-command.js
```

**AI:** Anthropic Claude Sonnet 4.6 — object identification, natural language understanding, educational content generation

**3D:** Three.js 0.183.2 — WebGL rendering, OrbitControls, procedural geometry, animation

---

## Setup

### Prerequisites
- Node.js 18+
- An Anthropic API key ([console.anthropic.com](https://console.anthropic.com))

### Install

```bash
npm install
```

### Configure environment

```bash
cp .env.example .env
```

Edit `.env` and add your key:

```
ANTHROPIC_API_KEY=sk-ant-...
PORT=3001
```

> For Netlify deployment, also add `ANTHROPIC_API_KEY` in your Netlify site settings under Environment variables.

### Run (development)

```bash
npm run dev
```

This starts both the Express API server (port 3001) and the Quasar dev server concurrently. Open the URL shown in the terminal (typically `http://localhost:9000`).

### Build for production

```bash
npm run build
# Output: dist/spa/
```

---

## Deployment (Netlify)

The repo includes `netlify.toml` configured for automatic deployment:

1. Push to GitHub
2. Connect the repo in Netlify
3. Set the `ANTHROPIC_API_KEY` environment variable in Netlify → Site settings → Environment variables
4. Deploy — Netlify builds the SPA and wires `/api/*` routes to serverless functions automatically

To verify the deployed function environment, visit `/api/env-debug` on your site. It will show whether `ANTHROPIC_API_KEY` is present without exposing the secret.

---

## APIs Used

| API | Purpose |
|-----|---------|
| Anthropic Claude Sonnet 4.6 | Object identification from text/image, NL command interpretation, educational summaries |
| Three.js | 3D rendering, procedural geometry, OrbitControls, animation |
| Quasar Framework | Vue 3 UI components, dark theme, routing |

---

## Limitations & Next Steps

**Current limitations:**
- 3D models are procedural geometric approximations; real GLB assets would need to be added to `/public/models/` and `/public/avatar/`
- Avatar animations are procedural (time-based transforms); a rigged GLB with Mixamo clips would give more realistic motion
- Supports 10 fixed object categories; expanding requires adding builders and updating the Claude prompt

**Next steps for NexEra integration:**
- Integrate Sketchfab or Poly.pizza APIs for real-asset retrieval by modelKey
- Add Mixamo-rigged GLB avatar with named animation clips (idle, walk, wave, etc.)
- Stream Claude responses for faster first-paint of educational summaries
- Add voice input for avatar commands (Web Speech API)
- Multi-object scenes: place several safety items together in one training environment
- Embed in an LMS via iframe with postMessage API for command injection
