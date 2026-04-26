import { NextResponse } from "next/server";
import { generateChannelAssetService } from "@/lib/ai/channel-asset-service";
import type { GenerateChannelAssetRequest } from "@/lib/domain/channel-asset";

export async function POST(request: Request) {
  try {
    const body: GenerateChannelAssetRequest = await request.json();

    if (!body.channel || !body.concept || !body.visualDirection) {
      return NextResponse.json(
        { error: "Faltan parámetros requeridos (channel, concept, visualDirection)" }, 
        { status: 400 }
      );
    }

    // Llamamos al servicio de derivación de assets para canales sociales
    const result = await generateChannelAssetService(body);

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error: unknown) {
    console.error("Error en generación de asset derivado:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
