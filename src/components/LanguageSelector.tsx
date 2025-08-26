'use client';

import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, getLanguageDisplayName } from '@/i18n';

interface LanguageSelectorProps {
  currentLang: string;
}

// 内部组件，只在客户端渲染
function LanguageSelectorClient({ currentLang }: LanguageSelectorProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLanguageChange = (newLang: string) => {
    // 使用 replace 而不是 push，避免添加到历史记录中，并禁用自动滚动
    router.replace(`/${newLang}`, { scroll: false });
  };

  if (!mounted) {
    return (
      <div className="border rounded px-3 py-1 text-sm bg-white text-gray-700 min-w-[120px] h-[32px] flex items-center">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  return (
    <select
      value={currentLang}
      onChange={(e) => handleLanguageChange(e.target.value)}
      className="border rounded px-3 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
    >
      {SUPPORTED_LANGUAGES.map((langCode) => (
        <option key={langCode} value={langCode}>
          {getLanguageDisplayName(langCode)}
        </option>
      ))}
    </select>
  );
}

// 使用 dynamic import 完全禁用 SSR
const LanguageSelector = dynamic(() => Promise.resolve(LanguageSelectorClient), {
  ssr: false,
  loading: () => (
    <div className="border rounded px-3 py-1 text-sm bg-white text-gray-700 min-w-[120px] h-[32px] flex items-center">
      <span className="text-gray-400">...</span>
    </div>
  )
});

export default LanguageSelector;