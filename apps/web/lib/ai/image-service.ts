import type { GenerateImageRequest, GenerateImageResult } from "@/lib/domain/ai-image";
import { generateGoogleImage } from "@/lib/integrations/google-ai/client";
import { generatePollinationsImage } from "@/lib/integrations/pollinations/client";

export async function generateImageService(request: GenerateImageRequest): Promise<GenerateImageResult> {
  console.log("Intentando generar imagen con proveedor principal (Google AI)...");
  try {
    const googleResult = await generateGoogleImage(request.prompt);
    
    return {
      url: googleResult.url,
      provider: "google-ai"
    };
  } catch (error: any) {
    console.warn(`[Google AI Fallo]: ${error.message}. Activando fallback a Pollinations AI.`);
    
    try {
      const pollinationsResult = await generatePollinationsImage(
        request.prompt, 
        request.seed, 
        request.width, 
        request.height
      );

      return {
        url: pollinationsResult.url,
        provider: "pollinations",
        warning: "Usando proveedor de respaldo debido a fallo en el servicio primario.",
        seed: pollinationsResult.seed
      };
    } catch (fallbackError: any) {
      console.error("[Pollinations AI Fallo]:", fallbackError);
      throw new Error(`Ambos proveedores de imagen fallaron. Último error: ${fallbackError.message}`);
    }
  }
}
