import { NextResponse } from "next/server";
import { getGemmaModel } from "@/lib/gemma";

const SYSTEM_PROMPT = `
Eres el "Nexus Trend-Finder", un agente experto en ecommerce, print on demand y marketing viral.
Tu trabajo es recibir una descripción de un diseño o concepto y decidir el mejor formato de producto para venderlo, 
además de generar el copy promocional y los metadatos.

Dispones de este mapa de Blueprints de Printify:
- T_SHIRT: 12 (Bella+Canvas 3001) - Ideal para diseños genéricos, arte pop, mensajes graciosos.
- HOODIE: 77 (Gildan 18500) - Ideal para diseños pesados, streetwear, cyberpunk, minimalista urbano.
- TOTE_BAG: 305 (Canvas Tote) - Ideal para arte botánico, eco-friendly, frases indie.
- MUG: 62 (White Mug 11oz) - Ideal para humor de oficina, frases motivacionales, mascotas.
- POSTER: 194 (Matte Poster) - Ideal para arte complejo, paisajes, vintage, cinematográfico.

Responde ÚNICAMENTE en formato JSON válido con esta estructura exacta:
{
  "blueprintId": 12,
  "productType": "T_SHIRT",
  "reason": "Explicación breve de por qué este producto encaja con el nicho.",
  "shopifyTitle": "Título SEO optimizado para tienda (máx 60 chars)",
  "socialCopy": "Copy persuasivo para Instagram/TikTok incluyendo hashtags relevantes.",
  "seoTags": ["tag1", "tag2", "tag3"]
}
REGLA CRÍTICA: NO incluyas markdown, saludos, explicaciones previas ni razonamientos en texto. Tu respuesta debe empezar directamente con '{' y terminar con '}'.
`;

export async function POST(request: Request) {
  try {
    const { concept } = await request.json();

    if (!concept) {
      return NextResponse.json({ error: "No concept provided" }, { status: 400 });
    }

    const model = getGemmaModel(); // defaults to gemini-1.5-flash
    const prompt = `${SYSTEM_PROMPT}\n\nConcepto de diseño: "${concept}"`;
    
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

    // Extract just the JSON object ignoring preambles/reasoning
    let cleanJson = responseText;
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleanJson = jsonMatch[0];
    }
    
    // Clean potential markdown blocks inside the match just in case
    cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "").trim();
    
    try {
      const decision = JSON.parse(cleanJson);
      return NextResponse.json(decision);
    } catch (parseError: any) {
      console.error("JSON Parse Error. Cleaned text was:", cleanJson);
      return NextResponse.json({ error: "JSON Parse Error: " + parseError.message, rawOutput: responseText }, { status: 500 });
    }

  } catch (error: any) {
    console.error("AI Decision General Error:", error);
    return NextResponse.json({ error: "Failed to generate AI decision: " + error.message }, { status: 500 });
  }
}
