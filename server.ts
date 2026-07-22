import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy init Gemini AI helper
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "FlowStack Kanban Platform", version: "1.0.0" });
});

// AI: Generate Description
app.post("/api/ai/generate-description", async (req, res) => {
  try {
    const { title, context, boardName } = req.body;
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate a concise, highly professional markdown task description for a Kanban card.
Card Title: "${title}"
Context/Notes: "${context || "Standard software development/project management card"}"
Board Name: "${boardName || "FlowStack Board"}"

Please output cleanly formatted Markdown with section headers like:
### Objective
### Key Requirements
### Acceptance Criteria`,
    });

    res.json({ description: response.text || "No description generated." });
  } catch (error: any) {
    console.error("AI Description Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate description" });
  }
});

// AI: Generate Subtasks
app.post("/api/ai/generate-subtasks", async (req, res) => {
  try {
    const { cardTitle, cardDescription } = req.body;
    if (!cardTitle) {
      return res.status(400).json({ error: "Card title is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({
        error: "GEMINI_API_KEY environment variable is not configured.",
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Break down this task into 3-6 actionable subtasks for a engineering/product team:
Title: "${cardTitle}"
Description: "${cardDescription || "N/A"}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Actionable title of the subtask" },
              estimatedHours: { type: Type.NUMBER, description: "Estimated hours to finish" },
            },
            required: ["title"],
          },
        },
      },
    });

    const subtasks = JSON.parse(response.text || "[]");
    res.json({ subtasks });
  } catch (error: any) {
    console.error("AI Subtasks Error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate subtasks" });
  }
});

// AI: Suggest Priority
app.post("/api/ai/suggest-priority", async (req, res) => {
  try {
    const { cardTitle, cardDescription, dueDate } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze this task and recommend a priority level ("low", "medium", "high", or "urgent") and a brief 1-sentence explanation:
Title: "${cardTitle}"
Description: "${cardDescription || "N/A"}"
Due Date: "${dueDate || "No deadline"}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            priority: { type: Type.STRING, description: "low, medium, high, or urgent" },
            reason: { type: Type.STRING, description: "1-sentence justification" },
          },
          required: ["priority", "reason"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    res.json(result);
  } catch (error: any) {
    console.error("AI Priority Error:", error);
    res.status(500).json({ error: error?.message || "Failed to suggest priority" });
  }
});

// AI: Risk Prediction
app.post("/api/ai/risk-prediction", async (req, res) => {
  try {
    const { cards } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Perform a project risk prediction for these cards:
${JSON.stringify(cards || [])}

Provide:
1) Overall Risk Score (0-100)
2) Identified Bottlenecks
3) 3 High Priority Recommendations to prevent delivery delays.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            riskScore: { type: Type.NUMBER },
            level: { type: Type.STRING, description: "Low, Medium, or High" },
            bottlenecks: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["riskScore", "level", "bottlenecks", "recommendations"],
        },
      },
    });

    const analysis = JSON.parse(response.text || "{}");
    res.json({ analysis });
  } catch (error: any) {
    console.error("AI Risk Prediction Error:", error);
    res.status(500).json({ error: error?.message || "Failed risk prediction" });
  }
});

// AI: Daily Executive Standup Summary
app.post("/api/ai/daily-summary", async (req, res) => {
  try {
    const { activities, boardName } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate an executive daily standup summary for board "${boardName || "FlowStack"}":
Recent Activities:
${JSON.stringify(activities || [])}

Format cleanly in markdown with:
- **Key Deliverables Completed Today**
- **In-Progress Focus Areas**
- **Blockers & High Risks**`,
    });

    res.json({ summary: response.text || "No summary generated." });
  } catch (error: any) {
    console.error("AI Daily Summary Error:", error);
    res.status(500).json({ error: error?.message || "Failed daily summary" });
  }
});

// AI: Task Rewriter
app.post("/api/ai/rewrite-task", async (req, res) => {
  try {
    const { text, tone } = req.body;
    const ai = getGeminiClient();
    if (!ai) {
      return res.status(500).json({ error: "GEMINI_API_KEY not set" });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Rewrite this task description to make it extremely clear, structured, and actionable with tone "${tone || "professional engineering"}":
"${text}"`,
    });

    res.json({ rewritten: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error?.message || "Rewrite failed" });
  }
});

// Serve frontend via Vite middleware in dev, static files in prod
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`FlowStack Server active on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
