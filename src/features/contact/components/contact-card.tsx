// src/features/farm/components/contact-card.tsx (สร้างไฟล์ใหม่)

"use client";

import Image from "next/image";
import Link from "next/link";
import type { FarmContactInfo } from "@/features/farm/farm.types";

const SocialLink = ({
  href,
  children,
}: {
  href: string | null | undefined;
  children: React.ReactNode;
}) => {
  if (!href) return null;
  return (
    <Link
      href={href}
      target="_blank"
      className="flex items-center justify-center w-10 h-10 bg-neutral-700 rounded-lg transition-colors hover:bg-neutral-600"
    >
      {children}
    </Link>
  );
};

function getSocialUrl(type: string, id?: string | null): string | null {
  if (!id) return null;
  switch (type) {
    case "instagram":
      return `https://instagram.com/${id}`;
    case "facebook":
      return `https://facebook.com/${id}`;
    case "line":
      return `https://line.me/ti/p/~${id}`;
    case "whatsapp":
      return `https://wa.me/${id}`;
    case "wechat":
      return `weixin://dl/add?${id}`;
    default:
      return null;
  }
}

export const ContactCard = ({ farm }: { farm: FarmContactInfo }) => (
  <div className="bg-[#1C1C1C] rounded-2xl p-6 w-full max-w-md mx-auto">
    <div className="flex flex-col items-center text-center">
      <Image
        src={farm.logo_url || "https://placehold.co/100x100/333/fff?text=Logo"}
        alt={`${farm.name} Logo`}
        width={80}
        height={80}
        className="w-18 h-18 rounded-full object-cover border-2 border-neutral-700"
      />
      <h3 className="mt-4 text-xl font-bold uppercase tracking-wider text-white">
        {farm.name}
      </h3>
      <p className="mt-1 text-sm text-neutral-400">{farm.breeder_name}</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <SocialLink href={getSocialUrl("instagram", farm.contact_instagram)}>
          <Image
            src="/images/instagram-icon.png"
            alt="instagram"
            width={20}
            height={20}
          />
        </SocialLink>

        <SocialLink href={getSocialUrl("facebook", farm.contact_facebook)}>
          <Image
            src="/images/facebook-icon.png"
            alt="facebook"
            width={10}
            height={20}
          />
        </SocialLink>

        <SocialLink href={getSocialUrl("line", farm.contact_line)}>
          <Image
            src="/images/line-icon.png"
            alt="line"
            width={20}
            height={20}
          />
        </SocialLink>

        <SocialLink href={getSocialUrl("whatsapp", farm.contact_whatsapp)}>
          <Image
            src="/images/whatsapp-icon.png"
            alt="whatsapp"
            width={20}
            height={20}
          />
        </SocialLink>

        <SocialLink href={getSocialUrl("wechat", farm.contact_wechat)}>
          <Image
            src="/images/wechat-icon.png"
            alt="wechat"
            width={20}
            height={20}
          />
        </SocialLink>
      </div>
    </div>
  </div>
);
