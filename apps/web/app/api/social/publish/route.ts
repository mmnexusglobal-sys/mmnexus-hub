import { NextResponse } from "next/server";
import { SocialPublishRequestSchema } from "@/lib/validations/social";
import { resolveMakePayload } from "@/lib/social/resolver";
import { sendToMakeWebhook } from "@/lib/integrations/make/client";
import type { SocialPublishResult } from "@/lib/domain/publish";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = SocialPublishRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid publish request", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const publishRequest = parsed.data;

    // 1. Resolver la intención del dominio a un payload técnico para el proveedor (Make)
    const makePayload = resolveMakePayload(publishRequest);

    // 2. Enviar a través del Integration Client
    console.log(`Enviando publicación a Make.com para ${publishRequest.channel}...`);
    const isSuccess = await sendToMakeWebhook(makePayload);

    // 3. Mappear resultado devuelta al dominio
    const result: SocialPublishResult = {
      channel: publishRequest.channel,
      status: publishRequest.scheduledAt ? "scheduled" : (isSuccess ? "published" : "failed"),
      provider: "make",
    };

    if (!isSuccess) {
      throw new Error("Make.com integration returned false without throwing.");
    }

    return NextResponse.json({
      success: true,
      message: `Publicación enviada exitosamente a ${publishRequest.channel}`,
      result,
    });

  } catch (error: unknown) {
    console.error("❌ Error en Social Publish API:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error al publicar en redes: " + msg },
      { status: 500 }
    );
  }
}
