import type { Metadata } from 'next';
import LoginClient from './LoginClient';

export const metadata: Metadata = {
  title: 'Login',
  description: 'Login to your MuftahX buyer or seller account.',
};

export default function LoginPage() {
  return <LoginClient />;
}
