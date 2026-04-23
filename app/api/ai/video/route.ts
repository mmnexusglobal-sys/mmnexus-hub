import { NextResponse } from "next/server";

import { z } from "zod";

const RequestSchema = z.object({
  imageUrl: z.string().url("Se requiere una URL de imagen válida"),
  socialCopy: z.string().optional(),
});

// Simulación de la API de Creatomate o Bannerbear
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = RequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: "Datos de entrada inválidos", details: parsedData.error.errors }, { status: 400 });
    }

    const { imageUrl, socialCopy } = parsedData.data;

    console.log("Iniciando renderizado de video en Creatomate...");
    console.log("Asset Base:", imageUrl.substring(0, 50) + "...");
    console.log("Hook de texto:", socialCopy);

    // Aquí iría el fetch() real a la API de Creatomate
    // const response = await fetch("https://api.creatomate.com/v1/renders", { ... })

    // Simulamos el tiempo de renderizado de un video en la nube (3 segundos)
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Retornamos un MP4 de demostración
    const mockVideoUrl = "https://cdn.creatomate.com/renders/mock_preview.mp4";

    return NextResponse.json({
      success: true,
      videoUrl: mockVideoUrl,
      message: "Video renderizado exitosamente para TikTok/Reels."
    });

  } catch (error: any) {
    console.error("Error generando video:", error);
    return NextResponse.json({ error: "Fallo en renderizado de video." }, { status: 500 });
  }
}
