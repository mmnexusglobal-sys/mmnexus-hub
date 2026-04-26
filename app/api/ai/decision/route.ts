import { NextResponse } from "next/server";

import { DecisionServiceError, generateDecisionService } from "@/lib/ai/decision-service";
import { GenerateDecisionRequestSchema } from "@/lib/validations/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedRequest = GenerateDecisionRequestSchema.safeParse(body);

    if (!parsedRequest.success) {
      return NextResponse.json(
        { error: "Invalid decision request", details: parsedRequest.error.format() },
        { status: 400 },
      );
    }

    const decision = await generateDecisionService(parsedRequest.data);
    return NextResponse.json(decision);
  } catch (error: unknown) {
    console.error("AI Decision General Error:", error);

    if (error instanceof DecisionServiceError) {
      return NextResponse.json(
        { error: error.message, rawOutput: error.rawOutput },
        { status: 500 },
      );
    }

    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to generate AI decision: " + message }, { status: 500 });
  }
}
