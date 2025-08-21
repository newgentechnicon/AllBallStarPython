import type { ProductDetail } from '@/features/product/product.types';

type MorphProp = ProductDetail['product_morphs'][0];

export function MorphTag({ morph }: { morph: MorphProp }) {
  if (!morph.morphs) return null;

  const category = morph.morphs.morph_categories;
  const subCategory = morph.morphs.morph_sub_categories;
  const color = subCategory?.color_hex || category?.color_hex || "#6B7280";
  const textColor = ["#E5E5E5"].includes(color) ? "#000000" : "#FFFFFF";

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
      style={{ backgroundColor: color, color: textColor }}
    >
      {morph.morphs.name}
    </span>
  );
};