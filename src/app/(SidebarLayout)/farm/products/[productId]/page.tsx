import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { notFound } from 'next/navigation';
import ProductDetailView from './ProductDetailView'; // Import the client component

// สร้าง Type ที่รวมข้อมูลทั้งหมดที่เราต้องการ
// This type is used by both the server component and the client component
export type ProductWithFarmAndMorphs = {
  id: number;
  farm_id: number;
  name: string;
  price: number | null;
  status: string | null;
  sex: string | null;
  year: string | null;
  description: string | null;
  image_urls: string[] | null;
  farms: {
    name: string;
    logo_url: string | null;
  } | null;
  product_morphs: {
    morphs: {
      name: string;
      morph_categories: {
        name: string;
        color_hex: string | null;
      } | null;
      morph_sub_categories: {
        name: string;
        color_hex: string;
      } | null;
    };
  }[];
};


export const dynamic = 'force-dynamic';

// --- Main Page Component (Server-Side) ---
export default async function ProductDetailPage({ params }: { params: { productId: string } }) {
    // FIX: เพิ่ม await เพื่อรอให้การเชื่อมต่อ Supabase เสร็จสมบูรณ์
    const supabase = await createClient();
    const productId = Number(params.productId);

    if (isNaN(productId)) {
        notFound();
    }

    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
        return redirect('/login');
    }
    const user = userData.user;

    // Fetch the specific product with all related data
    const { data: product, error } = await supabase
        .from('products')
        .select(`
            *,
            farms (*),
            product_morphs (
                morphs (
                    name,
                    morph_categories (name, color_hex),
                    morph_sub_categories (name, color_hex)
                )
            )
        `)
        .eq('id', productId)
        .eq('user_id', user.id) // Security check
        .single<ProductWithFarmAndMorphs>();

    if (error || !product) {
        console.error("Error fetching product or product not found:", error);
        notFound();
    }

    // Pass the fetched data to the client component for rendering
    return <ProductDetailView product={product} />;
}
