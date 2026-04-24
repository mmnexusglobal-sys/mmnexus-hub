export function mapToPrintifyCreateBody(input: {
  title: string;
  description: string;
  imageId: string;
  blueprintId: number;
  printProviderId: number;
  placeholder: "front" | "back";
  variants: Array<{ id: number; priceCents: number }>;
}) {
  return {
    title: input.title,
    description: input.description,
    blueprint_id: input.blueprintId,
    print_provider_id: input.printProviderId,
    variants: input.variants.map((variant) => ({
      id: variant.id,
      price: variant.priceCents,
      is_enabled: true,
    })),
    print_areas: [
      {
        variant_ids: input.variants.map((variant) => variant.id),
        placeholders: [
          {
            position: input.placeholder,
            images: [
              {
                id: input.imageId,
                x: 0.5,
                y: 0.5,
                scale: 0.8,
                angle: 0,
              },
            ],
          },
        ],
      },
    ],
  };
}
