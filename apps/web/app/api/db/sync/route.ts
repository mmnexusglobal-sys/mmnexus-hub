import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, doc, setDoc, updateDoc, arrayUnion } from "firebase/firestore";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, payload } = body;

    if (!db) {
      return NextResponse.json({ error: "Firebase no inicializado" }, { status: 500 });
    }

    if (action === 'save_design') {
      // payload = { designId, niche, imageUrl, ... }
      const docRef = doc(collection(db, 'campaigns'), payload.designId);
      await setDoc(docRef, {
        ...payload,
        status: 'approved',
        createdAt: new Date().toISOString(),
        socialAssets: {}
      });
      return NextResponse.json({ success: true, id: docRef.id });
    } 
    
    if (action === 'update_social_asset') {
      // payload = { designId, channel, data }
      const docRef = doc(collection(db, 'campaigns'), payload.designId);
      await setDoc(docRef, {
        socialAssets: {
          [payload.channel]: payload.data
        }
      }, { merge: true });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Acción no reconocida" }, { status: 400 });

  } catch (error: any) {
    console.error("Error en persistencia Firebase:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
