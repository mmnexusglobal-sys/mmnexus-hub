import { getGemmaModel } from "@/lib/gemma";

export interface GoogleImageResult {
  url: string;
  error?: string;
}

export interface GenerateGoogleTextOptions {
  primaryModel?: string;
  fallbackModel?: string;
}

export interface GoogleTextResult {
  text: string;
  model: string;
  fallbackUsed: boolean;
}

export async function generateGoogleText(
  prompt: string,
  options: GenerateGoogleTextOptions = {},
): Promise<GoogleTextResult> {
  const primaryModel = options.primaryModel ?? "gemma-4-31b-it";
  const fallbackModel = options.fallbackModel;
  const models = fallbackModel && fallbackModel !== primaryModel
    ? [primaryModel, fallbackModel]
    : [primaryModel];

  let lastError: unknown;

  for (const [index, modelName] of models.entries()) {
    try {
      const model = getGemmaModel(modelName);
      const result = await model.generateContent(prompt);

      return {
        text: result.response.text(),
        model: modelName,
        fallbackUsed: index > 0,
      };
    } catch (error: unknown) {
      lastError = error;
      console.warn(`Google AI text generation failed with model ${modelName}:`, error);
    }
  }

  throw lastError instanceof Error ? lastError : new Error("Google AI text generation failed");
}

export async function generateGoogleImage(prompt: string): Promise<GoogleImageResult> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
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
