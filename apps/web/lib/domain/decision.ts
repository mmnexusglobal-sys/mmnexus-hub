export interface Decision {
  productType: "T_SHIRT" | "HOODIE" | "TOTE_BAG" | "MUG" | "POSTER";
  shopifyTitle: string;
  socialCopy: string;
  seoTags?: string[];
  reason?: string;
  imagePrompt?: string;
}
