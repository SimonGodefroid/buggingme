'use client';

import { usePathname } from 'next/navigation';

export default function ReportPage() {
  const path = usePathname();
  return <>{`Coucou ${path}`}</>;
}
