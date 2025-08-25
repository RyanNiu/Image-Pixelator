'use client';

import { useEffect } from 'react';

interface LanguageProviderProps {
  lang: string;
  children: React.ReactNode;
}

export default function LanguageProvider({ lang, children }: LanguageProviderProps) {
  useEffect(() => {
    // 只在客户端设置语言属性
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  return <>{children}</>;
}