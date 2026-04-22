import { db } from "./firebase";
import { collection, addDoc, getDocs, query, orderBy, Timestamp } from "firebase/firestore";

// Tipo para un diseño generado
export interface SavedDesign {
  id?: string;
  concept: string;
  imageUrl: string;
  socialCopy: string;
  shopifyTitle: string;
  seoTags: string[];
  productType: string;
  createdAt: any;
}

// Verifica si Firebase está configurado correctamente
const isFirebaseConfigured = () => {
  return !!process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
};

// Función para guardar un diseño
export const saveDesign = async (designData: Omit<SavedDesign, "id" | "createdAt">) => {
  if (isFirebaseConfigured()) {
    try {
      const docRef = await addDoc(collection(db, "designs"), {
        ...designData,
        createdAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (e) {
      console.error("Error al guardar en Firebase:", e);
      return null;
    }
  } else {
    // Fallback a LocalStorage si no hay Firebase configurado
    const existing = localStorage.getItem("mmnexus_designs");
    const designs = existing ? JSON.parse(existing) : [];
    const newDesign = {
      ...designData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    designs.push(newDesign);
    localStorage.setItem("mmnexus_designs", JSON.stringify(designs));
    return newDesign.id;
  }
};

// Función para obtener todos los diseños guardados
export const getSavedDesigns = async (): Promise<SavedDesign[]> => {
  if (isFirebaseConfigured()) {
    try {
      const q = query(collection(db, "designs"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SavedDesign[];
    } catch (e) {
      console.error("Error obteniendo diseños de Firebase:", e);
      return [];
    }
  } else {
    // Fallback a LocalStorage
    const existing = localStorage.getItem("mmnexus_designs");
    if (!existing) return [];
    
    const designs = JSON.parse(existing);
    // Ordenar del más reciente al más antiguo
    return designs.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
};
