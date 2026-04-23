import { NextResponse } from "next/server";

import { z } from "zod";

const RequestSchema = z.object({
  prompt: z.string().min(1, "El prompt de la imagen es requerido"),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = RequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: "Prompt inválido", details: parsedData.error.format() }, { status: 400 });
    }

    const { prompt } = parsedData.data;

    const apiKey = process.env.GOOGLE_AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API Key de Google no configurada" }, { status: 500 });
    }

    console.log("🎨 Generando imagen con Imagen 4.0. Prompt:", prompt);

    // Usando la API REST directamente para mayor compatibilidad con Imagen 4.0
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          instances: [
            {
              prompt: prompt + " -- style: high quality, highly detailed, isolated on white background, 8k resolution, professional digital art, POD ready.",
            },
          ],
          parameters: {
            sampleCount: 1,
            aspectRatio: "1:1",
            outputOptions: {
                mimeType: "image/png"
            }
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("Google Imagen API retornó error, activando modelo de respaldo...", errorText);
      
      // Fallback a un generador gratuito (Pollinations AI)
      const cleanPrompt = prompt.substring(0, 500) + " isolated on white background high quality digital art vector style";
      const fallbackPrompt = encodeURIComponent(cleanPrompt);
      const fallbackUrl = `https://image.pollinations.ai/prompt/${fallbackPrompt}?width=1024&height=1024&nologo=true`;
      
      console.log("Intentando fallback URL:", fallbackUrl);
      const pollResponse = await fetch(fallbackUrl, {
        headers: {
          "User-Agent": "MMNexus-Hub-Bot/1.0",
          "Accept": "image/*"
        }
      });
      
      if (!pollResponse.ok) {
        const errText = await pollResponse.text();
        console.error("Pollinations falló con status:", pollResponse.status, errText);
        throw new Error("Error en el generador de respaldo (" + pollResponse.status + ")");
      }
      
      const arrayBuffer = await pollResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Image = buffer.toString('base64');
      
      return NextResponse.json({ 
        imageUrl: `data:image/jpeg;base64,${base64Image}`,
        warning: "Se usó modelo de respaldo porque Imagen 4 falló."
      });
    }

    const data = await response.json();
    
    if (data.predictions && data.predictions.length > 0) {
      const base64Image = data.predictions[0].bytesBase64Encoded;
      return NextResponse.json({ 
        imageUrl: `data:image/png;base64,${base64Image}` 
      });
    } else {
      throw new Error("La API no devolvió ninguna imagen.");
    }

  } catch (error: unknown) {
    console.error("Error en generación de imagen:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
