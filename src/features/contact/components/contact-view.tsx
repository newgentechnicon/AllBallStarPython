'use client';

import Image from "next/image";
import Link from "next/link";
import type { Farm } from "@/features/farm/farm.types";
import { 
  InstagramIcon, 
  FacebookIcon, 
  LineIcon,
  // สมมติว่ามีไอคอนเหล่านี้ใน src/components/ui/icons.tsx
  // WhatsAppIcon, 
  // WeChatIcon 
} from "@/components/ui/icons";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

// Type สำหรับ Props ที่รับเข้ามา
interface ContactViewProps {
  farms: Pick<Farm, 'id' | 'name' | 'logo_url' | 'breeder_name' | 'contact_instagram' | 'contact_facebook' | 'contact_line' | 'contact_whatsapp' | 'contact_wechat'>[];
}

// Component ย่อยสำหรับ Social Icon Link
const SocialLink = ({ href, children }: { href: string | null | undefined, children: React.ReactNode }) => {
  if (!href) return null;
  return (
    <Link href={href} target="_blank" className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-lg transition-colors hover:bg-neutral-600">
      {children}
    </Link>
  );
};

// Component ย่อยสำหรับ Contact Card 1 ใบ
const ContactCard = ({ farm }: { farm: ContactViewProps['farms'][0] }) => (
  <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-sm mx-auto">
    <div className="flex flex-col items-center text-center">
      <Image
        src={farm.logo_url || "https://placehold.co/100x100/333/fff?text=Logo"}
        alt={`${farm.name} Logo`}
        width={80}
        height={80}
        className="rounded-full object-cover border-2 border-neutral-700"
      />
      <h3 className="mt-4 text-xl font-bold uppercase tracking-wider text-white">{farm.name}</h3>
      <p className="mt-1 text-sm text-neutral-400">{farm.breeder_name}</p>
      <div className="mt-6 flex gap-3">
        <SocialLink href={farm.contact_instagram}><InstagramIcon className="h-5 w-5 text-white" /></SocialLink>
        <SocialLink href={farm.contact_facebook}><FacebookIcon className="h-5 w-5 text-white" /></SocialLink>
        <SocialLink href={farm.contact_line}><LineIcon className="h-5 w-5 text-white" /></SocialLink>
        {/* <SocialLink href={farm.contact_whatsapp}><WhatsAppIcon className="h-5 w-5 text-white" /></SocialLink> */}
        {/* <SocialLink href={farm.contact_wechat}><WeChatIcon className="h-5 w-5 text-white" /></SocialLink> */}
      </div>
    </div>
  </div>
);

export function ContactView({ farms }: ContactViewProps) {
  return (
    <div className="bg-black text-white font-sans">
      <Navbar />
      <main className="pt-24">
        {/* Header Section */}
        <section className="text-center px-4 pb-16">
          <h1 
            className="text-5xl font-medium tracking-widest uppercase text-neutral-400"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Contact Us
          </h1>
          <p className="mt-2 text-md font-light text-white">
            Trusted by breeders, Loved by collectors
          </p>
        </section>

        {/* Members Section */}
        <section className="px-4 pb-20">
          <div className="text-center mb-12">
            <h3 className="text-sm font-regular tracking-[0.2em] text-neutral-400 uppercase">Our Contact</h3>
            <h2 className="text-xl font-bold tracking-[0.1em] text-white uppercase mt-2">All Members</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {farms.map((farm) => (
              <ContactCard key={farm.id} farm={farm} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
