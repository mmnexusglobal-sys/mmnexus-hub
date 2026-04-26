import { NextResponse } from "next/server";

import { generateChannelAssetService } from "@/lib/ai/channel-asset-service";
import { GenerateChannelAssetRequestSchema } from "@/lib/validations/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = GenerateChannelAssetRequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: "Invalid channel asset request", details: parsedData.error.format() },
        { status: 400 },
      );
    }

    const result = await generateChannelAssetService(parsedData.data);

    return NextResponse.json({
      success: true,
      asset: result,
    });
  } catch (error: unknown) {
    console.error("Error generating channel asset:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
