import { promises as fs } from "fs";
import path from "path";

import type { Decision, GenerateDecisionRequest } from "@/lib/domain/decision";
import { generateGoogleText } from "@/lib/integrations/google-ai/client";
import { DecisionSchema } from "@/lib/validations/ai";

const PRIMARY_MODEL = "gemini-1.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash";

const SYSTEM_PROMPT = `
Eres el "Nexus Trend-Finder", un agente experto en ecommerce, print on demand y marketing viral.
Tu objetivo es el mercado de EE. UU. (US Market).
IMPORTANTE: Aunque el usuario te hable en espanol, tus respuestas para shopifyTitle, socialCopy y seoTags deben estar exclusivamente en ingles.

Analiza el concepto del usuario y elige el mejor tipo de producto de esta lista:
T_SHIRT: Generic, pop art, funny messages.
HOODIE: Heavy, streetwear, cyberpunk, urban minimalist.
TOTE_BAG: Botanical, eco-friendly, indie.
MUG: Office humor, motivational, pets.
POSTER: Complex art, landscapes, vintage, cinematic.

Tu respuesta debe ser unicamente un JSON valido con esta estructura exacta (sin markdown, sin bloques de codigo, solo JSON crudo):
{
  "productType": "T_SHIRT",
  "reason": "Explicacion breve en espanol de por que elegiste este producto",
  "shopifyTitle": "Title in English for the US Market",
  "socialCopy": "Catchy Instagram/TikTok caption in English with great hook",
  "seoTags": ["english", "tags", "only"],
  "imagePrompt": "A highly detailed, production-ready Midjourney/DALL-E style prompt in English describing the visual art to be generated. Include style, lighting, subjects, and isolated background instructions."
}

Regla critica: tu unica salida debe ser un objeto JSON valido. No incluyas markdown, saludos, explicaciones previas ni razonamientos.
`.trim();

export class DecisionServiceError extends Error {
  rawOutput?: string;

  constructor(message: string, options?: { rawOutput?: string; cause?: unknown }) {
    super(message, { cause: options?.cause });
    this.name = "DecisionServiceError";
    this.rawOutput = options?.rawOutput;
  }
}

async function loadDailyTrends(): Promise<unknown | null> {
  const trendsPath = path.join(process.cwd(), "data", "daily_trends.json");

  try {
    const fileContents = await fs.readFile(trendsPath, "utf8");
    return JSON.parse(fileContents);
  } catch (error: unknown) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === "ENOENT") {
      return null;
    }

    console.error("Could not load daily trends:", error);
    return null;
  }
}

function buildDecisionPrompt(concept: string, trends: unknown | null): string {
  const trendsContext = trends
    ? `\n\n[INSUMO DIARIO DE TENDENCIAS]\nUsa esta informacion actual del mercado para optimizar el producto elegido, el titulo, el social copy y los tags:\n${JSON.stringify(trends, null, 2)}\n`
    : "";

  return `${SYSTEM_PROMPT}${trendsContext}\n\nConcepto de diseno: "${concept}"`;
}

function extractDecisionJson(responseText: string): string {
  const withoutMarkdown = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
  const jsonMatch = withoutMarkdown.match(/\{[\s\S]*"productType"[\s\S]*\}/);

  return jsonMatch ? jsonMatch[0] : withoutMarkdown;
}

export async function generateDecisionService(
  request: GenerateDecisionRequest,
): Promise<Decision> {
  const trends = await loadDailyTrends();
  const prompt = buildDecisionPrompt(request.concept, trends);

  let responseText: string;
  try {
    const response = await generateGoogleText(prompt, {
      primaryModel: PRIMARY_MODEL,
      fallbackModel: FALLBACK_MODEL,
    });
    responseText = response.text;
  } catch (error: unknown) {
    throw new DecisionServiceError("Failed to generate AI decision", { cause: error });
  }

  const cleanJson = extractDecisionJson(responseText);

  try {
    const parsedDecision = JSON.parse(cleanJson);
    return DecisionSchema.parse(parsedDecision);
  } catch (error: unknown) {
    throw new DecisionServiceError("Failed to parse or validate AI decision output", {
      cause: error,
      rawOutput: responseText,
    });
  }
}
