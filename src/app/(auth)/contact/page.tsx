import { Montserrat } from 'next/font/google';
import { ContactView } from '@/features/contact/components/contact-view';
import { getAllFarms } from '@/features/farm/farm.services';

// Setup the font for the page
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '700', '900'],
  variable: '--font-montserrat',
});

export default async function ContactPage() {
  const farms = await getAllFarms();

  return (
    <div className={montserrat.variable}>
      <ContactView farms={farms} />
    </div>
  );
}