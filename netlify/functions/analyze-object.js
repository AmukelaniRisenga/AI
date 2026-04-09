exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    const command = body.command || "";

    // 👉 Example logic (replace with your AI / processing)
    const result = {
      input: command,
      message: "Object analyzed successfully 🔥",
      timestamp: new Date().toISOString()
    };

    return {
      statusCode: 200,
      body: JSON.stringify(result)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error",
        details: error.message
      })
    };
  }
};
