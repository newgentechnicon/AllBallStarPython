import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-neutral-950 border-gray-800 py-6">
      {/* container */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:justify-between md:items-start gap-8">
        
        {/* Left side */}
        <div className="md:w-1/2">
          <Image
            src="/images/logo-black.png"
            alt="Company Logo"
            width={40}
            height={40}
            quality={100}
            className="mb-4"
          />
          <p className="text-[#D1D5DB] text-sm leading-relaxed">
            Founded in 2023, All Star Ball Python is a collective of seven
            passionate and dedicated ball python breeders united by a shared
            mission: to produce high-quality, healthy, and visually stunning morph
            combinations. Each of our individual breeder brings unique expertise
            and creativity to the group, allowing us to offer a wide and diverse
            range of beautiful ball pythons.
          </p>
        </div>

        {/* Right side */}
        <div className="md:w-1/2">
          <h3 className="text-sm font-bold tracking-[0.3em] text-gray-400 uppercase mb-4">
            Contact Us
          </h3>
          <div className="flex gap-4">
            <Link
              href="#"
              className="flex p-3 w-12 h-12 bg-neutral-700 rounded-lg justify-center"
            >
              <Image
                src="/images/instagram-icon.png"
                alt="instagram"
                width={25}
                height={25}
                quality={100}
              />
            </Link>
            <Link
              href="#"
              className="flex p-3 w-12 h-12 bg-neutral-700 rounded-lg justify-center"
            >
              <Image
                src="/images/facebook-icon.png"
                alt="facebook"
                width={14}
                height={26}
                quality={100}
              />
            </Link>
            <Link
              href="#"
              className="flex p-3 w-12 h-12 bg-neutral-700 rounded-lg justify-center"
            >
              <Image
                src="/images/line-icon.png"
                alt="line"
                width={25}
                height={25}
                quality={100}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Full-width separator section */}
      <div className="mt-12 pt-6 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center text-white text-xs font-light">
          © 2025. All rights reserved
        </div>
      </div>
    </footer>
  );
}
