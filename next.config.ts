import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ixvdyiiquxklpjmzzkpz.supabase.co', // นี่คือ Hostname จาก Error ของคุณ
        port: '',
        pathname: '/storage/v1/object/public/**', // อนุญาตทุกไฟล์ใน bucket นี้
      },
    ],
  },
};

export default nextConfig;
