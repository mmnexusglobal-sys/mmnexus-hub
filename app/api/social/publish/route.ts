import { NextResponse } from "next/server";
import { PublishRequestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Zod validation
    const parsedData = PublishRequestSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json({ error: "Invalid request data", details: parsedData.error.errors }, { status: 400 });
    }

    const { imageUrl, socialCopy, productType, platform } = parsedData.data;
    const webhookUrl = process.env.MAKE_WEBHOOK_URL;
    
    if (!webhookUrl) {
      console.error("MAKE_WEBHOOK_URL not configured");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        imageUrl,
        socialCopy,
        productType,
        platform
      }),
    });

    if (!res.ok) {
      throw new Error(`Make webhook failed: ${res.statusText}`);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Social Publish API Error:", error);
    return NextResponse.json({ error: "Failed to publish social post: " + error.message }, { status: 500 });
  }
}
