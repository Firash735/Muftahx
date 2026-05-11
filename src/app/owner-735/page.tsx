import type { Metadata } from 'next';
import Admin from '../admin/page';

export const metadata: Metadata = {
  title: 'MuftahX Owner Admin',
  robots: {
    index: false,
    follow: false,
  },
};

export default function OwnerAdminPage() {
  return <Admin />;
}
