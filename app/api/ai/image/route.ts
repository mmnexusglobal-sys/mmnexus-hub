import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "El prompt es requerido" }, { status: 400 });
    }

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
      console.error("Error API Imagen:", errorText);
      throw new Error("Fallo en la generación de Google Imagen API");
    }

    const data = await response.json();
    
    // Google Imagen API retorna un arreglo de predicciones (predictions) con bytes codificados en base64
    if (data.predictions && data.predictions.length > 0) {
      const base64Image = data.predictions[0].bytesBase64Encoded;
      return NextResponse.json({ 
        imageUrl: `data:image/png;base64,${base64Image}` 
      });
    } else {
      throw new Error("La API no devolvió ninguna imagen.");
    }

  } catch (error: any) {
    console.error("Error en generación de imagen:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
