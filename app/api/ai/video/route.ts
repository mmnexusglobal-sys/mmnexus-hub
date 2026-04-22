import { NextResponse } from "next/server";

// Simulación de la API de Creatomate o Bannerbear
export async function POST(request: Request) {
  try {
    const { imageUrl, socialCopy } = await request.json();

    if (!imageUrl) {
      return NextResponse.json({ error: "Falta la imagen base." }, { status: 400 });
    }

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
