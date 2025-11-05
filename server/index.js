import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Load environment variables
dotenv.config();

console.log("🚀 Running server...");
console.log("🔑 GEMINI_API_KEY =", process.env.GEMINI_API_KEY ? "✅ Loaded" : "❌ Missing");

const app = express();
const PORT = process.env.PORT || 8080;

// ✅ Allow requests from localhost:5500 (frontend)
app.use(cors({
  origin: ["http://localhost:5500"],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"]
}));

app.use(helmet());
app.use(express.json({ limit: "20mb" }));

app.get("/", (req, res) => res.send("KisaanHal Gemini proxy running"));

// ---------- GEMINI API SETUP ----------
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ---------- /analyze endpoint ----------
  app.post("/analyze", async (req, res) => {
  try {
    const { imageBase64, crop, lang } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "no_image" });

    const mime = imageBase64.startsWith("data:image/png") ? "image/png" : "image/jpeg";
    const imagePart = {
      inlineData: {
        data: imageBase64.split(",")[1],
        mimeType: mime
      }
    };

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
You are an agricultural expert. Analyze this ${crop || "plant"} leaf image.

You must ALWAYS reply in JSON (no markdown, no text outside JSON).
If you are unsure, fill fields with "Unknown" or "Not Detected".

JSON format to follow exactly:
{
  "disease": "Exact disease name or 'Healthy Leaf'",
  "confidence": "0-100",
  "symptoms": ["short points"],
  "organic_solution": "Brief and practical",
  "chemical_solution": "Brief and practical",
  "schedule": "How often to apply or 'Not required'",
  "warning": "Safety or prevention advice"
}

Example output:
{
  "disease": "Leaf Rust",
  "confidence": "86",
  "symptoms": ["Orange-brown spots", "Yellowing edges"],
  "organic_solution": "Use neem oil 5ml/L weekly.",
  "chemical_solution": "Apply propiconazole 1ml/L spray.",
  "schedule": "Repeat after 10 days.",
  "warning": "Avoid spraying in sunlight; wear gloves."
}

Language for all values: ${lang === "hi" ? "Hindi" : "English"}.
Be concise and accurate. Do not skip any key.
`;


    const result = await model.generateContent([prompt, imagePart]);
    const text = result.response.text().trim();
    console.log("🧠 Raw AI Output:\n", text);

    // Try to extract JSON portion from text
    let parsed = {};
    try {
      const jsonPart = text.match(/\{[\s\S]*\}/)?.[0];
      if (jsonPart) parsed = JSON.parse(jsonPart);
      else throw new Error("No JSON found");
    } catch (e) {
      // fallback extraction from labeled text
      const extract = (label) => {
        const regex = new RegExp(`${label}:\\s*([^\\n]*)`, "i");
        const match = text.match(regex);
        return match ? match[1].trim() : "-";
      };

      parsed = {
        disease: extract("Disease") || "Unknown",
        confidence: extract("Confidence") || "-",
        symptoms: extract("Symptoms") || "-",
        organic_solution: extract("Organic Solution") || "-",
        chemical_solution: extract("Chemical Solution") || "-",
        schedule: extract("Schedule") || "-",
        warning: extract("Warning") || "-"
      };

      // If all fields blank, store raw response
      if (Object.values(parsed).every(v => v === "-" || v === "Unknown")) {
        parsed.raw_text = text;
      }
    }

    // Fallback summary if still missing info
    if (!parsed.disease && parsed.raw_text) {
      parsed.disease = parsed.raw_text.includes("healthy") ? "Healthy Leaf" : "Uncertain";
      parsed.confidence = "60";
      parsed.symptoms = ["Could not extract details"];
    }

    res.json(parsed);
  } catch (error) {
    console.error("❌ Backend Error:", error);
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
