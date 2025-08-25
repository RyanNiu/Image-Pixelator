'use client';

import { useState } from 'react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
}

interface FAQProps {
  title: string;
  subtitle: string;
  faqs: FAQItem[];
  contactText: string;
  contactButtonText: string;
  className?: string;
}

export default function FAQ({ title, subtitle, faqs, contactText, contactButtonText, className = '' }: FAQProps) {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const isOpen = (id: string) => openItems.has(id);

  return (
    <section id="faq" className={`py-16 bg-white ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{title}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{subtitle}</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div 
              key={faq.id} 
              className="bg-gray-50 rounded-lg transition-all duration-200 hover:shadow-md"
            >
              {/* Question */}
              <button
                onClick={() => toggleItem(faq.id)}
                className="w-full text-left p-6 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset rounded-lg"
                aria-expanded={isOpen(faq.id)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 pr-4">
                    {faq.question}
                  </h3>
                  <div className="flex-shrink-0">
                    <svg 
                      className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                        isOpen(faq.id) ? 'transform rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M19 9l-7 7-7-7" 
                      />
                    </svg>
                  </div>
                </div>
              </button>

              {/* Answer */}
              <div 
                className={`overflow-hidden transition-all duration-200 ${
                  isOpen(faq.id) ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}
              >
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            {contactText}
          </p>
          <a 
            href="mailto:support@imagepixelator.com"
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {contactButtonText}
          </a>
        </div>
      </div>
    </section>
  );
}

// 预定义的FAQ数据
export const DEFAULT_FAQS: FAQItem[] = [
  {
    id: 'what-is-pixelator',
    question: 'What is an image to pixel art converter?',
    answer: 'An image to pixel art converter is a powerful tool that transforms regular digital photos into retro-style pixel art. Our Image Pixelator uses advanced algorithms to reduce image resolution while preserving key visual elements, creating authentic pixel art perfect for game sprites, retro designs, and creative projects. This pixel art converter is the easiest way to turn your images into nostalgic 8-bit masterpieces.',
    category: 'general'
  },
  {
    id: 'how-it-works',
    question: 'How does the pixel art maker work?',
    answer: 'Our pixel art maker works by processing your uploaded image through our sophisticated pixelation engine. With our image pixel converter, you can easily adjust the pixel size, choose from various color modes (original, retro 8-bit, grayscale, sepia, vibrant), and select edge processing options. The pixel art converter processes all data directly in your browser for maximum privacy and instant results. This pixelate image tool gives you complete control over your pixel art creation process.',
    category: 'technical'
  },
  {
    id: 'is-free',
    question: 'Is pixelating images free with this tool?',
    answer: 'Yes, our image pixel converter is completely free to use with no hidden costs. You can pixelate images of any size (up to 20MB) without any watermarks or limitations. All pixel art conversion happens in your browser, so there are no server costs or hidden fees. Our pixel art maker allows unlimited conversions, making it the best free tool for creating pixel art from your images.',
    category: 'pricing'
  },
  {
    id: 'supported-formats',
    question: 'What image formats does the pixel art converter support?',
    answer: 'Our pixel art maker supports all major image formats including JPG, PNG, and WebP. The image to pixel art converter maintains the quality of your original image while transforming it into stunning pixel artwork in seconds. Whether you\'re using our pixelate image tool for game development, social media content, or artistic projects, our pixel art converter handles all popular formats seamlessly.',
    category: 'technical'
  },
  {
    id: 'privacy-protection',
    question: 'Is my privacy protected when I use the pixelate image tool?',
    answer: 'Absolutely. Our image pixel converter works entirely in your browser with zero data uploaded to any server. No images leave your device, and no data is stored or tracked. This pixel art converter ensures your privacy while providing professional-quality pixelation results. When you use our pixel art maker, you can be confident that your images and data remain completely private and secure.',
    category: 'privacy'
  }
];