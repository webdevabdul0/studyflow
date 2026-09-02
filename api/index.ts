import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(express.json({ limit: "50mb" }));

const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Route handlers
const healthHandler = (_req: express.Request, res: express.Response) => {
  res.json({ status: "ok", service: "StudyFlow" });
};

const generateImageHandler = async (req: express.Request, res: express.Response) => {
  try {
    const {
      prompt,
      aspectRatio = "1:1",
      imageSize = "1K",
      model = "gemini-3.1-flash-image-preview",
    } = req.body;

    if (!prompt || typeof prompt !== "string" || !prompt.trim()) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    let ai: GoogleGenAI;
    try {
      ai = getAI();
    } catch (err: any) {
      return res.status(400).json({
        error: "Gemini API key is not configured in server environment.",
        code: "MISSING_KEY",
      });
    }

    const validAspectRatios = [
      "1:1",
      "2:3",
      "3:2",
      "3:4",
      "4:3",
      "9:16",
      "16:9",
      "21:9",
      "1:4",
      "1:8",
      "4:1",
      "8:1",
    ];
    const safeRatio = validAspectRatios.includes(aspectRatio)
      ? aspectRatio
      : "1:1";

    const validSizes = ["512px", "1K", "2K", "4K"];
    const safeSize = validSizes.includes(imageSize) ? imageSize : "1K";

    const targetModel =
      model === "gemini-3-pro-image-preview" || model === "gemini-3-pro-image"
        ? "gemini-3-pro-image-preview"
        : "gemini-3.1-flash-image-preview";

    console.log(
      `[StudyFlow AI] Generating image. Model: ${targetModel}, Aspect Ratio: ${safeRatio}, Size: ${safeSize}`
    );

    const imageConfig: Record<string, string> = {
      aspectRatio: safeRatio,
    };

    if (safeSize) {
      imageConfig.imageSize = safeSize;
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: {
          parts: [{ text: prompt.trim() }],
        },
        config: {
          imageConfig,
        },
      });
    } catch (genError: any) {
      const fallbackModel =
        targetModel === "gemini-3-pro-image-preview"
          ? "gemini-3-pro-image"
          : "gemini-3.1-flash-image";
      console.warn(
        `Primary model ${targetModel} encountered error, attempting fallback ${fallbackModel}:`,
        genError.message
      );
      response = await ai.models.generateContent({
        model: fallbackModel,
        contents: {
          parts: [{ text: prompt.trim() }],
        },
        config: {
          imageConfig,
        },
      });
    }

    let imageUrl: string | null = null;
    let textOutput = "";

    if (response.candidates && response.candidates[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData?.data) {
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${part.inlineData.data}`;
          break;
        } else if (part.text) {
          textOutput += part.text;
        }
      }
    }

    if (!imageUrl) {
      return res.status(500).json({
        error: "No image data was returned by the AI model.",
        details: textOutput,
      });
    }

    return res.json({
      imageUrl,
      text: textOutput,
      model: targetModel,
      aspectRatio: safeRatio,
      imageSize: safeSize,
    });
  } catch (error: any) {
    console.error("[StudyFlow AI] Image generation failed:", error);
    return res.status(500).json({
      error: error.message || "Failed to generate image",
      details: error.toString(),
    });
  }
};

// Handlers registered both with and without /api prefix
// for resilient Vercel and Express matching
app.get("/api/health", healthHandler);
app.get("/health", healthHandler);

app.post("/api/generate-image", generateImageHandler);
app.post("/generate-image", generateImageHandler);

export default app;
