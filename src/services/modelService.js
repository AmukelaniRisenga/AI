export async function analyzeObject({ text, imageBase64, mimeType }) {
  const res = await fetch('/.netlify/functions/analyze-object', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, imageBase64, mimeType }),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }))
    throw new Error(err.error || 'Request failed')
  }
  return res.json()
}

export function modelKeyToUrl(modelKey) {
  return `/models/${modelKey}.glb`
}
