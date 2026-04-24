import { NextResponse } from "next/server";
import { getGemmaModel } from "@/lib/gemma";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { DecisionSchema } from "@/lib/validations";

const getDailyTrends = () => {
  try {
    const trendsPath = path.join(process.cwd(), "data", "daily_trends.json");
    if (fs.existsSync(trendsPath)) {
      const data = fs.readFileSync(trendsPath, "utf8");
      return JSON.parse(data);
    }
  } catch (e) {
    console.error("Could not load daily trends:", e);
  }
  return null;
};

const SYSTEM_PROMPT = `
Eres el "Nexus Trend-Finder", un agente experto en ecommerce, print on demand y marketing viral.
Tu objetivo es el mercado de EE. UU. (US Market). 
IMPORTANTE: Aunque el usuario te hable en español, TUS RESPUESTAS PARA shopifyTitle, socialCopy y seoTags DEBEN ESTAR EXCLUSIVAMENTE EN INGLÉS.
          
Analiza el concepto del usuario y elige el MEJOR tipo de producto de esta lista:
T_SHIRT: Generic, pop art, funny messages.
HOODIE: Heavy, streetwear, cyberpunk, urban minimalist.
TOTE_BAG: Botanical, eco-friendly, indie.
MUG: Office humor, motivational, pets.
POSTER: Complex art, landscapes, vintage, cinematic.

Tu respuesta DEBE ser ÚNICAMENTE un JSON válido con esta estructura exacta (sin markdown, sin bloques de código, solo JSON crudo):
{
  "productType": "T_SHIRT",
  "reason": "Explicación breve en español de por qué elegiste este producto",
  "shopifyTitle": "Title in English for the US Market",
  "socialCopy": "Catchy Instagram/TikTok caption in English with great hook",
  "seoTags": ["english", "tags", "only"],
  "imagePrompt": "A highly detailed, production-ready Midjourney/DALL-E style prompt in English describing the visual art to be generated. Include style, lighting, subjects, and isolated background instructions."
}
REGLA CRÍTICA: Tu única salida debe ser un objeto JSON válido. NO incluyas markdown, NO incluyas saludos, NO incluyas explicaciones previas ni razonamientos. Solo el JSON.
`;

export async function POST(request: Request) {
  try {
    const { concept } = await request.json();

    if (!concept) {
      return NextResponse.json({ error: "No concept provided" }, { status: 400 });
    }

    const trends = getDailyTrends();
    let trendsContext = "";
    if (trends) {
      trendsContext = `\n\n[INSUMO DIARIO DE TENDENCIAS]\nUsa esta información actual del mercado para optimizar el producto elegido, el título, el social copy y los tags:\n${JSON.stringify(trends, null, 2)}\n`;
    }

    const model = getGemmaModel(); // defaults to gemini-1.5-flash
    const prompt = `${SYSTEM_PROMPT}${trendsContext}\n\nConcepto de diseño: "${concept}"`;
    
    let responseText = "";
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (apiError: any) {
      console.warn("Error with default model. Trying fallback model (gemini-2.5-flash)...");
      try {
        const fallbackModel = getGemmaModel("gemini-2.5-flash");
        const fallbackResult = await fallbackModel.generateContent(prompt);
        responseText = fallbackResult.response.text();
      } catch (fallbackError: any) {
        console.error("Error from Google Generative AI API (Both models failed):", fallbackError);
        return NextResponse.json({ error: "API Error: " + fallbackError.message }, { status: 500 });
      }
    }
    
    console.log("Raw AI Response:", responseText);

    let cleanJson = responseText;
    
    // Si la IA envolvió toda su respuesta en llaves por error (ej. { Role: ... "productType": "T_SHIRT" }), 
    // fallará el JSON.parse. Vamos a intentar extraer la parte que parece JSON real.
    const blueprintMatch = responseText.match(/\{[\s\S]*"productType"[\s\S]*\}/);
    if (blueprintMatch) {
      cleanJson = blueprintMatch[0];
    }

    // Limpiar markdown residual
    cleanJson = cleanJson.replace(/```json/gi, "").replace(/```/gi, "").trim();

    // Fix común: Si el texto empieza con { pero tiene texto plano antes del "productType", 
    // intentamos buscar el primer "{" justo antes de "productType"
    if (cleanJson.startsWith('{') && !cleanJson.includes('"productType":')) {
         // Fallback
    }
    
    try {
      const decision = JSON.parse(cleanJson);
      // Validamos fuertemente con Zod
      const validatedData = DecisionSchema.parse(decision);
      return NextResponse.json(validatedData);
    } catch (parseError: any) {
      console.error("JSON or Validation Error. Cleaned text was:", cleanJson, parseError);
      return NextResponse.json({ error: "Validation Error: " + parseError.message, rawOutput: responseText }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Decision General Error:", error);
    return NextResponse.json({ error: "Failed to generate AI decision: " + error.message }, { status: 500 });
  }
}
