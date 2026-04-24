import { NextResponse } from "next/server";
import { getGemmaModel } from "@/lib/gemma";
import fs from "fs";
import path from "path";
import { z } from "zod";
import { FullTrendReportSchema } from "@/lib/validations";

const SYSTEM_PROMPT = `
Eres un analista de datos experto. Tu tarea es extraer la información clave de un reporte de tendencias de mercado (texto sin formato) y convertirlo ESTRICTAMENTE en un objeto JSON con la siguiente estructura.
NO incluyas markdown, saludos, ni bloques de código. SOLO el JSON válido en UTF-8.

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

const RequestSchema = z.object({
  reportText: z.string().min(1, "El texto del reporte no puede estar vacío"),
});

export async function POST(request: Request) {
  try {
    // Ensure we parse the body handling standard utf-8 encoding
    const body = await request.json();
    const parsedRequest = RequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos", details: parsedRequest.error.format() }, { status: 400 });
    }

    const { reportText } = parsedRequest.data;

    const model = getGemmaModel("gemini-1.5-flash");
    const prompt = `${SYSTEM_PROMPT}\n\nReporte a analizar:\n"${reportText}"`;
    
    let responseText = "";
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (apiError: unknown) {
      console.warn("Fallo con gemini-1.5-flash. Intentando fallback (gemini-2.5-flash)...", apiError);
      const fallbackModel = getGemmaModel("gemini-2.5-flash");
      const fallbackResult = await fallbackModel.generateContent(prompt);
      responseText = fallbackResult.response.text();
    }
    
    // Limpiar markdown residual
    const cleanJson = responseText.replace(/```json/gi, "").replace(/```/gi, "").trim();
    
    // Validar JSON estructuralmente con Zod
    let parsedTrends;
    try {
      const rawJson = JSON.parse(cleanJson);
      const validationResult = FullTrendReportSchema.safeParse(rawJson);
      
      if (!validationResult.success) {
        console.error("Validation failed:", validationResult.error);
        return NextResponse.json({ 
          error: "Gemini devolvió un formato incorrecto", 
          details: validationResult.error.format() 
        }, { status: 502 });
      }
      parsedTrends = validationResult.data;
    } catch (e) {
      return NextResponse.json({ error: "Gemini no devolvió un JSON válido" }, { status: 502 });
    }
    
    // Guardar en data/daily_trends.json con explícito UTF-8
    const trendsPath = path.join(process.cwd(), "data", "daily_trends.json");
    const dataDir = path.dirname(trendsPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    fs.writeFileSync(trendsPath, JSON.stringify(parsedTrends, null, 2), { encoding: "utf8" });
    
    return NextResponse.json({ success: true, message: "Trends updated successfully", data: parsedTrends });

  } catch (error: unknown) {
    console.error("AI Trends Extractor Error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to process trends report: " + msg }, { status: 500 });
  }
}
