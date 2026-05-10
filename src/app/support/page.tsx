import type { Metadata } from 'next';
import { Suspense } from 'react';
import SupportClient from './SupportClient';

export const metadata: Metadata = {
  title: 'MuftahX AI Support',
  description: 'Ask MuftahX support questions about Google signup, buyer sourcing, seller verification, documents, and admin review.',
};

export default function SupportPage() {
  return (
    <Suspense fallback={null}>
      <SupportClient />
    </Suspense>
  );
}
