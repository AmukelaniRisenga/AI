export async function handler(event) {
  try {
    const { command } = JSON.parse(event.body);

    // 🔥 Your AI logic here (replace with API later if needed)
    let action = "idle";

    const text = command.toLowerCase();

    if (text.includes("wave")) action = "wave";
    else if (text.includes("walk")) action = "walk";
    else if (text.includes("crouch")) action = "crouch";
    else if (text.includes("hello")) action = "wave";

    return {
      statusCode: 200,
      body: JSON.stringify({ action }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
}
