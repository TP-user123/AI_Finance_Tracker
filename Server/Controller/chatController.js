import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

export const handleChat = async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message cannot be empty." });
  }

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: message }],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CHAT_API_KEY}`,
        },
      }
    );

    const botReply = response?.data?.choices?.[0]?.message?.content;

    if (!botReply) {
      return res
        .status(502)
        .json({ error: "Empty response from AI service." });
    }

    res.json({ reply: botReply });
  } catch (error) {
    console.error("Chatbot error:", error?.response?.data || error.message);
    res
      .status(500)
      .json({ error: "Failed to get response from external AI API" });
  }
};