export const decisionProductTypes = [
  "T_SHIRT",
  "HOODIE",
  "TOTE_BAG",
  "MUG",
  "POSTER",
] as const;

export type DecisionProductType = (typeof decisionProductTypes)[number];

export interface GenerateDecisionRequest {
  concept: string;
}

export interface Decision {
  productType: DecisionProductType;
  shopifyTitle: string;
  socialCopy: string;
  seoTags: string[];
  reason: string;
  imagePrompt?: string;
  blueprintId?: string | number;
}
