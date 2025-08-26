'use client';

import { useState, useEffect } from 'react';
import { DownloadFormat, ImageDownloader } from '@/lib/downloadUtils';

interface FormatSelectorProps {
  value: DownloadFormat;
  onChange: (format: DownloadFormat) => void;
  className?: string;
  label?: string;
}

export default function FormatSelector({ value, onChange, className, label }: FormatSelectorProps) {
  const [supportedFormats, setSupportedFormats] = useState<DownloadFormat[]>(['png']); // 默认只有 PNG
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // 标记为客户端渲染
    setIsClient(true);
    
    // 在客户端获取支持的格式
    const formats = ImageDownloader.getSupportedFormats();
    setSupportedFormats(formats);
  }, []);

  // 确保选中的格式在支持列表中
  useEffect(() => {
    if (isClient && !supportedFormats.includes(value)) {
      onChange(supportedFormats[0] || 'png');
    }
  }, [isClient, supportedFormats, value, onChange]);

  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as DownloadFormat)}
        className={className || "w-full border rounded px-2 py-1 text-xs bg-white"}
      >
        {supportedFormats.map(format => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
}