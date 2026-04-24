import { NextResponse } from 'next/server';
import { BrandProfile, BrandSettings } from '@mmnexus/core';

// Simulador de una base de datos PostgreSQL temporal en memoria
// En un entorno real, aquí usarías Prisma o Supabase para leer de la tabla `core.brand_profiles`
let mockDbStore: BrandSettings | null = null;

export async function GET() {
  // Si no hay nada guardado, cargamos el por defecto del núcleo
  if (!mockDbStore) {
    const defaultProfile = BrandProfile.loadDefault();
    return NextResponse.json(defaultProfile.settings);
  }
  return NextResponse.json(mockDbStore);
}

export async function POST(request: Request) {
  try {
    const data: BrandSettings = await request.json();
    
    // Aquí iría el INSERT / UPDATE en PostgreSQL
    // Ejemplo: await sql`UPDATE core.brand_profiles SET settings = ${JSON.stringify(data)} WHERE id = 1`
    mockDbStore = data;

    return NextResponse.json({ success: true, message: 'Perfil de marca actualizado con éxito en la Base de Datos.' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error procesando la solicitud' }, { status: 500 });
  }
}
