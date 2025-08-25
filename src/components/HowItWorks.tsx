'use client';

interface Step {
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

interface HowItWorksProps {
  title: string;
  subtitle: string;
  steps: Step[];
  className?: string;
}

export default function HowItWorks({ 
  title, 
  subtitle, 
  steps, 
  className = '' 
}: HowItWorksProps) {
  return (
    <section id="how-to-use" className={`py-16 bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600">{subtitle}</p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="text-center group">
              {/* Step Number Circle */}
              <div className={`w-16 h-16 ${step.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white font-bold text-xl">{step.number}</span>
              </div>
              
              {/* Step Content */}
              <h3 className="text-xl font-semibold mb-3 text-gray-900">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.description}</p>
              
              {/* Icon */}
              <div className="mt-4 text-4xl opacity-60 group-hover:opacity-80 transition-opacity">
                {step.icon}
              </div>
              
              {/* Connection Line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-1/2 w-full h-0.5 bg-gray-200 transform translate-x-1/2 z-0" 
                     style={{ left: 'calc(50% + 2rem)' }}>
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Call to Action */}
        {/* <div className="text-center mt-12">
          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                const uploadSection = document.querySelector('#upload');
                if (uploadSection) {
                  uploadSection.scrollIntoView({ behavior: 'smooth' });
                }
              }
            }}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            开始使用
            <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div> */}
      </div>
    </section>
  );
}

// 预定义的默认步骤配置
export const DEFAULT_STEPS: Step[] = [
  {
    number: 1,
    title: 'Upload Image',
    description: 'Choose any JPG, PNG, or WebP image from your device. Drag & drop or click to browse.',
    icon: '📁',
    color: 'bg-gradient-to-br from-blue-500 to-blue-600'
  },
  {
    number: 2,
    title: 'Customize Settings',
    description: 'Adjust pixel size, choose color modes, and apply preset effects for different styles.',
    icon: '🎨',
    color: 'bg-gradient-to-br from-purple-500 to-purple-600'
  },
  {
    number: 3,
    title: 'Download Result',
    description: 'Get your pixelated image in high quality PNG, JPG, or WebP format.',
    icon: '⬇️',
    color: 'bg-gradient-to-br from-green-500 to-green-600'
  }
];