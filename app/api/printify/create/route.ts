import { NextResponse } from "next/server";
import { createProductInputSchema } from "@/lib/validations/printify";
import { uploadImageToPrintify, createPrintifyProduct } from "@/lib/integrations/printify/client";
import { resolvePrintifyProduct } from "@/lib/printify/resolver";
import { mapToPrintifyCreateBody } from "@/lib/printify/mapper";

export async function POST(request: Request) {
  try {
    const json = await request.json();
    const parsed = createProductInputSchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input", details: parsed.error.flatten() }, { status: 400 });
    }

    const input = parsed.data;
    const resolved = resolvePrintifyProduct(input.decision);
    
    console.log("Subiendo imagen a Printify...");
    const uploaded = await uploadImageToPrintify(input.imageUrl);

    console.log("Mapeando y creando producto en Printify...");
    const body = mapToPrintifyCreateBody({
      title: input.decision.shopifyTitle,
      description: (input.decision.socialCopy || "") + "\n\nHashtags: " + (input.decision.seoTags?.join(" ") || ""),
      imageId: uploaded.id,
      blueprintId: resolved.blueprintId,
      printProviderId: resolved.printProviderId,
      placeholder: resolved.placeholder,
      variants: resolved.variants,
    });

    const product = await createPrintifyProduct(body);
    console.log("✅ Producto creado exitosamente:", product.id);

    return NextResponse.json({ 
      success: true, 
      productId: product.id,
      message: "Producto creado en Printify correctamente",
      details: {
        status: "Draft Creado",
        productId: product.id,
        title: product.title,
      }
    });
  } catch (error: unknown) {
    console.error("❌ Error en Printify Pipeline:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json(
      { error: "Error conectando con Printify: " + msg },
      { status: 500 }
    );
  }
}
