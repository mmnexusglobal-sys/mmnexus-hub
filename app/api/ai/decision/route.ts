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
No incluyas markdown (como \`\`\`json) en tu respuesta, solo el objeto JSON crudo.
`;

export async function POST(request: Request) {
  try {
    const { concept } = await request.json();

    if (!concept) {
      return NextResponse.json({ error: "No concept provided" }, { status: 400 });
    }

    const model = getGemmaModel(); // defaults to gemini-1.5-flash
    const prompt = `${SYSTEM_PROMPT}\n\nConcepto de diseño: "${concept}"`;
    
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean potential markdown blocks if the model still returns them
    const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
    const decision = JSON.parse(cleanJson);

    return NextResponse.json(decision);
  } catch (error) {
    console.error("AI Decision Error:", error);
    return NextResponse.json({ error: "Failed to generate AI decision" }, { status: 500 });
  }
}
