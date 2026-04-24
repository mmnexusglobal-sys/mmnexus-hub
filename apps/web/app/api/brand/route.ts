import { NextResponse } from 'next/server';
import { BrandProfile, BrandSettings } from '@mmnexus/core';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export async function GET() {
  if (!db) {
    console.warn('Firebase DB no inicializado. Retornando configuración por defecto.');
    return NextResponse.json(BrandProfile.loadDefault().settings);
  }

  try {
    const docRef = doc(db, 'core', 'brand_profile');
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return NextResponse.json(docSnap.data() as BrandSettings);
    } else {
      // Si el documento no existe en Firebase, retorna el default
      return NextResponse.json(BrandProfile.loadDefault().settings);
    }
  } catch (error) {
    console.error('Error leyendo brand profile de Firebase:', error);
    return NextResponse.json(BrandProfile.loadDefault().settings);
  }
}

export async function POST(request: Request) {
  if (!db) {
    return NextResponse.json(
      { success: false, message: 'Firebase DB no está configurado.' }, 
      { status: 500 }
    );
  }

  try {
    const data: BrandSettings = await request.json();
    
    const docRef = doc(db, 'core', 'brand_profile');
    // Usamos setDoc para crear o sobreescribir completamente el documento
    await setDoc(docRef, data);

    return NextResponse.json({ 
      success: true, 
      message: 'Perfil de marca sincronizado con Firebase exitosamente.' 
    });
  } catch (error) {
    console.error('Error escribiendo en Firebase:', error);
    return NextResponse.json(
      { success: false, message: 'Error procesando la solicitud hacia Firebase' }, 
      { status: 500 }
    );
  }
}
