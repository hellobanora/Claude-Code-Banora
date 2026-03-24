const Anthropic = require("@anthropic-ai/sdk");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method not allowed" };
  }

  try {
    const { text, currentTime, currentDate } = JSON.parse(event.body);
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 500,
      messages: [{
        role: "user",
        content: `You are a task parser for a chiropractic clinic shift manager. The current time is ${currentTime} and date is ${currentDate}. Parse the following task note into a JSON object with these fields:
- "description": string — clean, concise task description
- "dueTime": string | null — time in 24hr format "HH:MM" if mentioned or inferrable, null if no time
- "priority": "high" | "medium" | "low" — inferred from urgency language (urgent/ASAP = high, routine = low, default medium)
- "category": "Patient Admin" | "Clinic Operations" | "Marketing/Business" | "General"

Do not include any other text, markdown, or explanation. Just the JSON object.

Task note: "${text}"`
      }],
    });

    const responseText = message.content[0].text;

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: responseText,
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ error: "Failed to parse task" }),
    };
  }
};
