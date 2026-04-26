import { env } from "@/lib/server/env";

export async function uploadImageToPrintify(base64Data: string) {
  const base64Clean = base64Data.includes(",") ? base64Data.split(",")[1] : base64Data;
  
  const uploadRes = await fetch("https://api.printify.com/v1/uploads/images.json", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.PRINTIFY_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      file_name: "nexus_design.png",
      contents: base64Clean
    })
  });

  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new Error("Fallo al subir la imagen: " + err);
  }
  
  return uploadRes.json();
}

export async function createPrintifyProduct(body: any) {
  const createRes = await fetch(`https://api.printify.com/v1/shops/${env.PRINTIFY_SHOP_ID}/products.json`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${env.PRINTIFY_API_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Fallo al crear producto: ${errorText}`);
  }

  return createRes.json();
}
