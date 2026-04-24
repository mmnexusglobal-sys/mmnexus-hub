import { NextResponse } from "next/server";

export async function GET() {
  const token = process.env.PRINTIFY_API_TOKEN;

  if (!token) {
    return NextResponse.json({ error: "No PRINTIFY_API_TOKEN found in environment" }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.printify.com/v1/shops.json", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json({ error: "Failed to fetch from Printify", details: errorText }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Server Error", details: String(error) }, { status: 500 });
  }
}
