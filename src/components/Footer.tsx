'use client';

import Image from 'next/image';

interface FooterLink {
  href: string;
  label: string;
  external?: boolean;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface FooterProps {
  description: string;
  sections: FooterSection[];
  currentYear?: number;
  className?: string;
}

export default function Footer({ 
  description, 
  sections, 
  currentYear = new Date().getFullYear(),
  className = '' 
}: FooterProps) {
  const handleLinkClick = (href: string, external = false) => {
    if (typeof window === 'undefined') return;
    
    if (external) {
      window.open(href, '_blank', 'noopener noreferrer');
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <footer className={`bg-gray-900 text-white py-12 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <Image 
                src="/LOGO.png" 
                alt="Image Pixelator Logo" 
                width={32} 
                height={32} 
                className="rounded-lg" 
              />
              <h3 className="text-xl font-bold">Image Pixelator</h3>
            </div>
            <p className="text-gray-400 mb-4 max-w-md leading-relaxed">
              {description}
            </p>
          </div>

          {/* Footer Sections */}
          {sections.map((section, index) => (
            <div key={index}>
              <h4 className="font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <button
                      onClick={() => handleLinkClick(link.href, link.external)}
                      className="hover:text-white transition-colors text-left"
                    >
                      {link.label}
                      {link.external && (
                        <svg className="inline w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      )}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          {/* Copyright */}
          <div className="text-center text-sm text-gray-400 mb-4">
            <p>&copy; {currentYear} Image Pixelator. All rights reserved.</p>
          </div>

          {/* Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://softwarebolt.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src="https://softwarebolt.com/assets/images/badge.png" 
                alt="Software Bolt" 
                className="h-12"
              />
            </a>
            <a 
              href="https://twelve.tools" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src="https://twelve.tools/badge0-light.svg" 
                alt="Featured on Twelve Tools" 
                className="h-12"
              />
            </a>
            <a 
              href="https://turbo0.com/item/image-pixelator" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src="https://img.turbo0.com/badge-listed-light.svg" 
                alt="Listed on Turbo0" 
                className="h-12"
              />
            </a>
            <a 
              href="https://fazier.com/launches/www.imagepixelator.pics" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-opacity hover:opacity-80"
            >
              <img 
                src="https://fazier.com/api/v1//public/badges/launch_badges.svg?badge_type=featured&theme=dark" 
                alt="Fazier badge" 
                width={250}
                className="h-12"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

// 预定义的页脚配置
export const DEFAULT_FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Tools',
    links: [
      { href: '#upload', label: 'Image Pixelator' },
      { href: '#examples', label: 'Examples' },
      { href: '#how-to-use', label: 'User Guide' }
    ]
  },
  {
    title: 'Legal',
    links: [
      { href: '#privacy', label: 'Privacy Policy' },
      { href: '#terms', label: 'Terms of Service' },
      { href: 'mailto:info@imagepixelator.pics', label: 'Contact', external: true }
    ]
  }
];