exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const command = data.command?.toLowerCase();

    let action = "idle";

    if (command.includes("wave")) action = "wave";
    else if (command.includes("walk")) action = "walk";
    else if (command.includes("crouch")) action = "crouch";
    else if (command.includes("hello")) action = "wave";

    return {
      statusCode: 200,
      body: JSON.stringify({ action }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
