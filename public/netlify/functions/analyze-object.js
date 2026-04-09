export async function handler() {
  return {
    statusCode: 200,
    body: JSON.stringify({
      detected: "object",
      confidence: 0.95
    }),
  };
}
