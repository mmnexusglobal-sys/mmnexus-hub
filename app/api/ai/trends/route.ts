import { NextResponse } from "next/server";
import { getGemmaModel } from "@/lib/gemma";
import fs from "fs";
import path from "path";

const SYSTEM_PROMPT = `
Eres un analista de datos experto. Tu tarea es extraer la información clave de un reporte de tendencias de mercado (texto sin formato) y convertirlo ESTRICTAMENTE en un objeto JSON con la siguiente estructura.
NO incluyas markdown, saludos, ni bloques de código. SOLO el JSON válido.

Estructura esperada:
{
  "date": "YYYY-MM-DD",
  "niches": [
    {
      "name": "Nombre del nicho",
      "description": "Breve descripción",
      "idealDesigns": ["Diseño 1", "Diseño 2"],
      "recommendedProducts": ["Producto 1"],
      "emergingSubNiche": "Subnicho (opcional)"
    }
  ],
  "viralTrends": [
    {
      "concept": "Concepto viral",
      "description": "Descripción"
    }
  ],
  "socialSignals": {
    "opportunity": "Oportunidad detectada en redes sociales",
    "signals": ["señal 1", "señal 2"]
  },
  "highConversionKeywords": [
    "Keyword 1", "Keyword 2"
  ]
}
`;

export async function POST(request: Request) {
  try {
    const { reportText } = await request.json();

    if (!reportText) {
      return NextResponse.json({ error: "No reportText provided" }, { status: 400 });
    }

    const model = getGemmaModel("gemini-1.5-flash");
    const prompt = `${SYSTEM_PROMPT}\n\nReporte a analizar:\n"${reportText}"`;
    
    let responseText = "";
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (apiError: any) {
      console.warn("Fallo con gemini-1.5-flash. Intentando fallback (gemini-2.5-flash)...");
      const fallbackModel = getGemmaModel("gemini-2.5-flash");
      const fallbackResult = await fallbackModel.generateContent(prompt);
      responseText = fallbackResult.response.text();
    }
    
    // Limpiar markdown residual
    let cleanJson = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
    
    // Validar JSON
    const parsedData = JSON.parse(cleanJson);
    
    // Guardar en data/daily_trends.json
    const trendsPath = path.join(process.cwd(), "data", "daily_trends.json");
    
    // Crear el directorio si no existe
    const dataDir = path.dirname(trendsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(trendsPath, JSON.stringify(parsedData, null, 2), "utf8");
    
    return NextResponse.json({ success: true, message: "Trends updated successfully", data: parsedData });

  } catch (error: any) {
    console.error("AI Trends Extractor Error:", error);
    return NextResponse.json({ error: "Failed to process trends report: " + error.message, rawOutput: error.rawOutput || "" }, { status: 500 });
  }
}
