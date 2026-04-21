import { NextResponse } from "next/server";

const PRINTIFY_TOKEN = process.env.PRINTIFY_API_TOKEN;
const SHOP_ID = process.env.PRINTIFY_SHOP_ID;

export async function POST(request: Request) {
  try {
    const data = await request.json();
    console.log("📥 Iniciando Pipeline de Printify con datos:", data);

    if (!PRINTIFY_TOKEN || !SHOP_ID) {
      return NextResponse.json(
        { error: "Credenciales de Printify no configuradas en el entorno." },
        { status: 500 }
      );
    }

    // 1. OBTENER PROVEEDORES (Para el blueprint seleccionado)
    // NOTA: Usamos el proveedor por defecto (ej. Monster Digital = 29)
    const printProviderId = 29; 

    // 2. CREAR PRODUCTO MOCK EN PRINTIFY
    // Para simplificar la primera fase de automatización, usaremos valores por defecto.
    // Más adelante conectaremos esto con la IA Generadora de Imágenes (Stable Diffusion / DALL-E)
    
    const printifyBody = {
      title: data.shopifyTitle,
      description: data.socialCopy + "\n\nHashtags: " + (data.seoTags?.join(" ") || ""),
      blueprint_id: data.blueprintId,
      print_provider_id: printProviderId,
      variants: [
        { id: 17887, price: 2500, is_enabled: true } // Variante genérica (dependerá del blueprint)
      ],
      print_areas: [
        {
          variant_ids: [17887],
          placeholders: [
            {
              position: "front",
              images: [] // Aquí irá el ID de la imagen subida en la fase 2
            }
          ]
        }
      ]
    };

    // Simularemos la llamada a Printify por seguridad antes de hacer POST reales,
    // pero verificaremos que el Token es válido consultando las tiendas del usuario.
    const verifyResponse = await fetch("https://api.printify.com/v1/shops.json", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${PRINTIFY_TOKEN}`,
        "Content-Type": "application/json"
      }
    });

    if (!verifyResponse.ok) {
      const errorText = await verifyResponse.text();
      throw new Error(`Fallo de Autenticación con Printify: ${errorText}`);
    }

    const shops = await verifyResponse.json();
    console.log("✅ Conexión con Printify exitosa. Tiendas detectadas:", shops.length);

    // TODO: Hacer el POST real a https://api.printify.com/v1/shops/${SHOP_ID}/products.json
    // Por ahora retornamos éxito para validar el pipeline del frontend.

    return NextResponse.json({
      success: true,
      message: "Pipeline ejecutado correctamente",
      details: {
        status: "Draft Creado (Simulado)",
        shop: SHOP_ID,
        title: data.shopifyTitle,
        blueprint: data.blueprintId
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
