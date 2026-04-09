exports.handler = async (event) => {
  try {
    const { command } = JSON.parse(event.body);

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model: "claude-3-haiku-20240307",
        max_tokens: 50,
        messages: [
          {
            role: "user",
            content: `Convert this into a single avatar action (wave, walk, crouch, idle): ${command}`
          }
        ]
      })
    });

    const data = await response.json();

    const reply = data.content[0].text.toLowerCase();

    return {
      statusCode: 200,
      body: JSON.stringify({ action: reply }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
