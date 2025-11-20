import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

// Create express app
const app = express();

app.use(cors());
app.use(express.json());

// Root route
app.get("/", (req, res) => {
  res.send("✅ Gemini AI Studio server running — POST /api/chat");
});

// POST route
app.post("/", async (req, res) => {
  const { message } = req.body;
  const key = process.env.GEMINI_API_KEY;

  if (!message) return res.status(400).json({ error: "Message is required." });
  if (!key)
    return res.status(500).json({ error: "Missing GEMINI_API_KEY in .env." });

  try {
    // 🔥 IMPORTANT: Use the model YOUR KEY supports → gemini-2.5-flash
    const url =
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${key}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a disaster management assistant providing safety and emergency guidance. Respond clearly and concisely to: "${message}".`
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    console.log("🔍 Gemini API Response:", JSON.stringify(data, null, 2));
    console.log("🔍 Gemini API Response:", JSON.stringify(data, null, 2));

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No response from Gemini.";

    res.json({ reply });
  } catch (error) {
    console.error("❌ Gemini API error:", error);
    res.status(500).json({ error: "Failed to connect to Gemini API." });
  }
});

// Server listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Gemini AI Studio Server running at http://localhost:${PORT}`)
);
