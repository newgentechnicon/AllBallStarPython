"use client";

import type { Farm } from "@/features/farm/farm.types";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { ContactCard } from "@/features/contact/components/contact-card"; 

interface ContactViewProps {
  farms: Pick<
    Farm,
    | "id"
    | "name"
    | "logo_url"
    | "breeder_name"
    | "contact_instagram"
    | "contact_facebook"
    | "contact_line"
    | "contact_whatsapp"
    | "contact_wechat"
  >[];
}

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
            <h3 className="text-sm font-regular tracking-[0.2em] text-neutral-400 uppercase">
              Our Contact
            </h3>
            <h2 className="text-xl font-bold tracking-[0.1em] text-white uppercase mt-2">
              All Members
            </h2>
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