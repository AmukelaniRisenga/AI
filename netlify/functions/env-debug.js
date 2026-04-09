export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      ANTHROPIC_API_KEY_SET: Boolean(process.env.ANTHROPIC_API_KEY),
      NODE_ENV: process.env.NODE_ENV || null,
      NOTE: 'This endpoint only reports whether the env var is present; it does not return the key value.',
    }),
  }
}
