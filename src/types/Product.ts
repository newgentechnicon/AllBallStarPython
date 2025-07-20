export interface Product {
  id: number;
  name: string;
  status: string | null;
  sex: string | null;
  price: number | null;
  image_urls: string[] | null;
  product_morphs: {
    morphs: {
      name: string;
    };
  }[];
}