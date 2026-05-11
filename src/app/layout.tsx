import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'MuftahX — Verified Kenyan Export Marketplace',
    template: '%s | MuftahX',
  },
  description: 'MuftahX connects verified Kenyan exporters with global buyers through product proof, compliance documents, market intelligence, and fraud-risk review.',
  openGraph: {
    title: 'MuftahX — Verified Kenyan Export Marketplace',
    description: 'Verified Kenyan exporters, buyer-ready product pages, compliance documents, and market intelligence.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
