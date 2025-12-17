'use client';

import {ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}

