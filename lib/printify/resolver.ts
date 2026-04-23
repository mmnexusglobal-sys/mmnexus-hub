import { printifyCatalog, CatalogProductType } from "./catalog";
import type { Decision } from "@/lib/domain/decision";

export function resolvePrintifyProduct(decision: Decision) {
  const product = printifyCatalog[decision.productType as CatalogProductType];
  if (!product) {
    throw new Error(`Unsupported productType: ${decision.productType}`);
  }

  const enabledVariants = product.variants.filter((variant) => variant.enabled);
  if (enabledVariants.length === 0) {
    throw new Error(`No enabled variants for ${decision.productType}`);
  }

  return {
    ...product,
    variants: enabledVariants,
  };
}
