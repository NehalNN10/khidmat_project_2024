// app/pets/page.js
import { Suspense } from 'react';
import PetsPageClient from '@/components/PetsPageClient';

export default function PetsPage() {
  return (
  <Suspense fallback={<div>Loading...</div>}> 
    <PetsPageClient />
  </Suspense>
  );
}