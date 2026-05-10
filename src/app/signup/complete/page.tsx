import type { Metadata } from 'next';
import { Suspense } from 'react';
import SignupCompleteClient from './SignupCompleteClient';

export const metadata: Metadata = {
  title: 'Complete MuftahX Signup',
  description: 'Complete Google signup and continue to your MuftahX buyer or seller dashboard.',
};

export default function SignupCompletePage() {
  return (
    <Suspense fallback={null}>
      <SignupCompleteClient />
    </Suspense>
  );
}
