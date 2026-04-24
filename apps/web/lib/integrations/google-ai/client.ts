import { env } from "@/lib/server/env";

export interface GoogleImageResult {
  url: string;
  error?: string;
}

export async function generateGoogleImage(prompt: string): Promise<GoogleImageResult> {
  const apiKey = env.GOOGLE_AI_API_KEY;
  if (!apiKey) {
    throw new Error("GOOGLE_AI_API_KEY is not set.");
  }

  // En la implementación actual usábamos Pollinations por fallo de Gemini Imagen,
  // pero dejamos el andamiaje técnico listo para cuando se use Gemini.
  const payload = {
    instances: [{ prompt }],
    parameters: { sampleCount: 1 }
  };

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/imagegeneration:predict?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Google AI Image generation failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const base64Image = data?.predictions?.[0]?.bytesBase64Encoded;
  
  if (!base64Image) {
    throw new Error("Google AI no devolvió una imagen en formato base64.");
  }

  return {
    url: `data:image/png;base64,${base64Image}`
  };
}
