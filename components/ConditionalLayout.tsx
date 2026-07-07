'use client';

import {ReactNode} from 'react';
import {usePathname} from 'next/navigation';
import Layout from './Layout';

interface ConditionalLayoutProps {
  children: ReactNode;
}

// 사이드바/헤더 없이 전체화면으로 렌더할 경로
const FULLSCREEN_PATHS = ['/login'];

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isFullscreen = FULLSCREEN_PATHS.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`),
  );

  if (isFullscreen) {
    return <>{children}</>;
  }

  return <Layout>{children}</Layout>;
}
