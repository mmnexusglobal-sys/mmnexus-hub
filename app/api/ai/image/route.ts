import { NextResponse } from "next/server";
import { GenerateImageRequestSchema } from "@/lib/validations/ai";
import { generateImageService } from "@/lib/ai/image-service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = GenerateImageRequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Prompt o parámetros de imagen inválidos", details: parsedData.error.format() }, 
        { status: 400 }
      );
    }

    const imageRequest = parsedData.data;

    // Llamamos al servicio de dominio (él se encarga de probar Google AI y hacer fallback a Pollinations)
    const result = await generateImageService(imageRequest);

    return NextResponse.json({
      success: true,
      imageUrl: result.url,
      provider: result.provider,
      warning: result.warning,
      seed: result.seed
    });

  } catch (error: unknown) {
    console.error("Error en generación de imagen:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
