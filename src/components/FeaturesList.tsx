'use client';

interface Feature {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface FeaturesListProps {
  title: string;
  subtitle: string;
  features: Feature[];
  className?: string;
}

export default function FeaturesList({ 
  title, 
  subtitle, 
  features, 
  className = '' 
}: FeaturesListProps) {
  return (
    <section id="features" className={`py-16 bg-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={feature.id} 
              className={`text-center p-6 rounded-xl ${feature.color} hover:shadow-lg transition-all duration-300 group hover:scale-105`}
            >
              {/* Icon */}
              <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                {feature.icon}
              </div>
              
              {/* Title */}
              <h3 className="text-lg font-semibold mb-2 text-gray-900 group-hover:text-gray-800">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-gray-600 text-sm leading-relaxed group-hover:text-gray-700">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// 预定义的功能特色
export const DEFAULT_FEATURES: Feature[] = [
  {
    id: 'multiple-formats',
    title: 'Multiple Formats',
    description: 'Support for JPG, PNG, WebP input and output formats',
    color: 'bg-blue-50 hover:bg-blue-100',
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
        </path>
      </svg>
    )
  },
  {
    id: 'real-time-preview',
    title: 'Real-time Preview',
    description: 'See changes instantly as you adjust settings',
    color: 'bg-purple-50 hover:bg-purple-100',
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zM2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z">
        </path>
      </svg>
    )
  },
  {
    id: 'privacy-first',
    title: '100% Private',
    description: 'All processing happens in your browser, no data sent to servers',
    color: 'bg-green-50 hover:bg-green-100',
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z">
        </path>
      </svg>
    )
  },
  {
    id: 'lightning-fast',
    title: 'Lightning Fast',
    description: 'Instant processing with optimized algorithms',
    color: 'bg-yellow-50 hover:bg-yellow-100',
    icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M13 10V3L4 14h7v7l9-11h-7z">
        </path>
      </svg>
    )
  },
  {
    id: 'smart-presets',
    title: 'Smart Presets',
    description: '6 built-in presets for different art styles',
    color: 'bg-red-50 hover:bg-red-100',
    icon: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 011-1h1a2 2 0 100-4H7a1 1 0 01-1-1V7a1 1 0 011-1h3a1 1 0 001-1V4z">
        </path>
      </svg>
    )
  },
  {
    id: 'multi-language',
    title: 'Multi-language',
    description: 'Available in English, Chinese, and more languages',
    color: 'bg-indigo-50 hover:bg-indigo-100',
    icon: (
      <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129">
        </path>
      </svg>
    )
  }
];