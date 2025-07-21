export interface Product {
  id: number;
  farm_id: number;
  name: string;
  price: number | null;
  status: string | null;
  sex: string | null;
  year: string | null;
  description: string | null;
  image_urls: string[] | null;
  deleted_at: string | null;
  farms: {
    name: string;
    logo_url: string | null;
  } | null;
  product_morphs: {
    morphs: {
      id: number;
      name: string;
      morph_categories: {
        id: number;
        name: string;
        color_hex: string | null;
      } | null;
      morph_sub_categories: {
        id: number;
        name: string;
        color_hex: string;
      } | null;
    };
  }[];
}
