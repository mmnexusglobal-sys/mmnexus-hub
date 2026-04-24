import { printifyCatalog, CatalogProductType } from "./catalog";
import type { DecisionData } from "@/lib/validations";

export function resolvePrintifyProduct(decision: DecisionData) {
  const typeStr = (decision.productType || "").toUpperCase().replace("-", "_");
  const product = printifyCatalog[typeStr as CatalogProductType] || printifyCatalog.T_SHIRT;
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
