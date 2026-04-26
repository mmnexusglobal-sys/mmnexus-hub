import { NextResponse } from "next/server";

import { publishSocialService } from "@/lib/social/publish-service";
import { SocialPublishRequestSchema } from "@/lib/validations/social";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = SocialPublishRequestSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid publish request", details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    const publishRequest = parsed.data;
    console.log(`Sending social publish job for ${publishRequest.channel}...`);

    const result = await publishSocialService(publishRequest);

    return NextResponse.json({
      success: true,
      message: `Publish job prepared for ${publishRequest.channel}`,
      result,
    });
  } catch (error: unknown) {
    console.error("Error in social publish API:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Failed to publish to social channel: " + msg },
      { status: 500 },
    );
  }
}
