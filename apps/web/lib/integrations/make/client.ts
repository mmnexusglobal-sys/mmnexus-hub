import { env } from "@/lib/server/env";

export interface MakeWebhookPayload {
  platform: string;
  action: string;
  data: Record<string, any>;
}

export async function sendToMakeWebhook(payload: MakeWebhookPayload): Promise<boolean> {
  if (!env.MAKE_WEBHOOK_URL) {
    console.warn("MAKE_WEBHOOK_URL not configured. Simulating success.");
    return true; // En modo desarrollo o si no está configurado, simulamos éxito
  }

  const response = await fetch(env.MAKE_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Make webhook failed: ${response.status} ${errorText}`);
  }

  return true;
}
