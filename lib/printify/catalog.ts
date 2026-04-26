export type CatalogProductType =
  | "T_SHIRT"
  | "HOODIE"
  | "TOTE_BAG"
  | "MUG"
  | "POSTER";

export interface CatalogVariant {
  id: number;
  label: string;
  enabled: boolean;
  priceCents: number;
}

export interface CatalogProduct {
  productType: CatalogProductType;
  blueprintId: number;
  printProviderId: number;
  placeholder: "front" | "back";
  variants: CatalogVariant[];
}

export const printifyCatalog: Record<CatalogProductType, CatalogProduct> = {
  T_SHIRT: {
    productType: "T_SHIRT",
    blueprintId: 12,
    printProviderId: 29,
    placeholder: "front",
    variants: [
      { id: 18542, label: "White / L", enabled: true, priceCents: 2500 },
    ],
  },
  HOODIE: {
    productType: "HOODIE",
    blueprintId: 77, // placeholder blueprint
    printProviderId: 29,
    placeholder: "front",
    variants: [
      { id: 70830, label: "Black / L", enabled: true, priceCents: 4500 },
    ],
  },
  TOTE_BAG: {
    productType: "TOTE_BAG",
    blueprintId: 385,
    printProviderId: 39,
    placeholder: "front",
    variants: [
      { id: 43224, label: "One Size", enabled: true, priceCents: 1500 },
    ],
  },
  MUG: {
    productType: "MUG",
    blueprintId: 82,
    printProviderId: 29,
    placeholder: "front",
    variants: [
      { id: 5432, label: "11oz", enabled: true, priceCents: 1200 },
    ],
  },
  POSTER: {
    productType: "POSTER",
    blueprintId: 106,
    printProviderId: 1,
    placeholder: "front",
    variants: [
      { id: 100, label: "18x24", enabled: true, priceCents: 1800 },
    ],
  },
};
