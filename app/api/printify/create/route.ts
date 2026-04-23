import { NextResponse } from "next/server";

import { z } from "zod";

const RequestSchema = z.object({
  imageUrl: z.string().min(1, "Se requiere una imagen en formato base64"),
  shopifyTitle: z.string().optional(),
  socialCopy: z.string().optional(),
  seoTags: z.array(z.string()).optional(),
});

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedData = RequestSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ error: "Datos de producto inválidos", details: parsedData.error.errors }, { status: 400 });
    }

    const data = parsedData.data;
    console.log("📥 Iniciando Pipeline de Printify con validación Zod pasada");

    if (!PRINTIFY_TOKEN || !SHOP_ID) {
      return NextResponse.json(
        { error: "Credenciales de Printify no configuradas en el entorno." },
        { status: 500 }
      );
    }

    // 1. Extraer el Base64 limpio de la imagen
    const base64Clean = data.imageUrl.split(',')[1];
    
    // 2. Subir imagen a Printify Media Library
    console.log("Subiendo imagen a Printify...");
    const uploadRes = await fetch("https://api.printify.com/v1/uploads/images.json", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTIFY_TOKEN}`,
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
    const uploadedImage = await uploadRes.json();
    console.log("Imagen subida con ID:", uploadedImage.id);

    // 3. OBTENER PROVEEDORES (Para el blueprint seleccionado)
    // NOTA: Usamos el proveedor por defecto (Monster Digital = 29, Blueprint = 12 para T-Shirt)
    // Para no fallar en validaciones, forzamos un blueprint básico si el de la IA no coincide
    const safeBlueprintId = 12; // Men's Cotton Crew Tee
    const printProviderId = 29; // Monster Digital
    const variantId = 18542; // ID real para Variante "White / L" en Monster Digital para Blueprint 12

    // 4. CREAR PRODUCTO EN PRINTIFY
    const printifyBody = {
      title: data.shopifyTitle || "MMNexus Design",
      description: (data.socialCopy || "") + "\n\nHashtags: " + (data.seoTags?.join(" ") || ""),
      blueprint_id: safeBlueprintId,
      print_provider_id: printProviderId,
      variants: [
        { id: variantId, price: 2500, is_enabled: true }
      ],
      print_areas: [
        {
          variant_ids: [variantId],
          placeholders: [
            {
              position: "front",
              images: [
                {
                  id: uploadedImage.id,
                  x: 0.5,
                  y: 0.5,
                  scale: 0.8,
                  angle: 0
                }
              ]
            }
          ]
        }
      ]
    };

    console.log("Creando Draft en Printify...");
    const createRes = await fetch(`https://api.printify.com/v1/shops/${SHOP_ID}/products.json`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${PRINTIFY_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(printifyBody)
    });

    if (!createRes.ok) {
      const errorText = await createRes.text();
      throw new Error(`Fallo al crear producto: ${errorText}`);
    }

    const product = await createRes.json();
    console.log("✅ Producto creado exitosamente:", product.id);

    return NextResponse.json({
      success: true,
      message: "Producto creado en Printify correctamente",
      details: {
        status: "Draft Creado",
        productId: product.id,
        shop: SHOP_ID,
        title: product.title,
      }
    });

  } catch (error: any) {
    console.error("❌ Error en Printify Pipeline:", error);
    return NextResponse.json(
      { error: "Error conectando con Printify: " + error.message },
      { status: 500 }
    );
  }
}
