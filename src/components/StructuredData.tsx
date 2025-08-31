'use client';

interface StructuredDataProps {
  lang: string;
}

export default function StructuredData({ lang }: StructuredDataProps) {
  // WebApplication schema
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: '🎯 Image Pixelator - FREE Online Pixel Art Tool',
    description: '✨ 100% FREE pixel art converter! No registration or login required. Convert images to pixel art instantly in your browser - completely private and secure forever!',
    url: `https://imagepixelator.pics/${lang}`,
    applicationCategory: 'GraphicsApplication',
    operatingSystem: 'Any',
    permissions: 'No permissions or login required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2030-12-31',
      description: '100% FREE forever - No hidden costs, no registration required'
    },
    featureList: [
      '🎯 100% FREE - No hidden costs or watermarks',
      '🔒 No login or registration required',
      '🛡️ 100% private - All processing in your browser',
      'Convert images to pixel art instantly',
      'Multiple output formats (PNG, JPG, WebP)',
      'Real-time preview with instant results',
      'Multiple preset styles (8-bit, arcade, minecraft)',
      'Undo/Redo functionality',
      'Support for large images up to 20MB'
    ],
    screenshot: 'https://imagepixelator.pics/og-image.png',
    author: {
      '@type': 'Organization',
      name: 'Image Pixelator Team'
    },
    inLanguage: [lang, 'en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko']
  };

  // SoftwareApplication schema
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: '🎯 Image Pixelator - FREE Pixel Art Tool',
    alternateName: [
      'Free Pixel Art Generator',
      'No Login Pixel Art Converter',
      'Browser Pixel Art Tool',
      '100% Free Image Pixelator'
    ],
    description: '✨ Professional online tool for converting regular images into pixel art. 100% FREE forever, no registration required, completely private. Features real-time preview, multiple export formats, and complete privacy protection.',
    url: `https://imagepixelator.pics/${lang}`,
    applicationCategory: 'GraphicsApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.',
    memoryRequirements: 'Minimum 1GB RAM recommended',
    storageRequirements: 'No storage required - runs entirely in browser',
    permissions: 'No special permissions or login required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      priceValidUntil: '2030-12-31',
      description: '🎯 100% FREE forever! No registration, no login, no hidden costs, no watermarks'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '2150',
      bestRating: '5',
      worstRating: '1'
    },
    author: {
      '@type': 'Organization',
      name: 'Image Pixelator Team',
      url: 'https://imagepixelator.pics'
    }
  };

  // WebSite schema
  const webSiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: '🎯 Image Pixelator - FREE Online Pixel Art Tool',
    alternateName: [
      'Free Pixel Art Generator',
      'No Login Pixel Art Converter',
      '100% Free Image Pixelator'
    ],
    description: '✨ 100% FREE online image to pixel art converter! No registration required, completely private, instant results in your browser.',
    url: 'https://imagepixelator.pics',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://imagepixelator.pics/{lang}?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    },
    inLanguage: ['en', 'zh', 'es', 'fr', 'ru', 'hi', 'ko'],
    author: {
      '@type': 'Organization',
      name: 'Image Pixelator Team'
    }
  };

  // HowTo schema for the process
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Convert Images to Pixel Art - FREE & No Login Required',
    description: '✨ Step-by-step guide to convert any image into pixel art using our 100% FREE online tool. No registration or login required!',
    image: 'https://imagepixelator.pics/og-image.png',
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0',
      description: '100% FREE - No hidden costs'
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Digital Image',
        description: 'Any JPG, PNG, or WebP image file (up to 20MB)'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Web Browser',
        description: 'Modern web browser with JavaScript enabled - No software installation required'
      }
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: '📁 Upload Image (No Login Required)',
        text: 'Select and upload your image file (JPG, PNG, or WebP format) - No registration or account needed!',
        image: 'https://imagepixelator.pics/step1.png'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: '⚙️ Customize Settings (100% FREE)',
        text: 'Adjust pixel size, choose color modes, and apply preset effects - All features completely free!',
        image: 'https://imagepixelator.pics/step2.png'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: '⬇️ Download Result (No Watermarks)',
        text: 'Download your pixelated image in high quality format - No watermarks or limitations!',
        image: 'https://imagepixelator.pics/step3.png'
      }
    ]
  };

  // FAQ schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Is the pixel art converter completely free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '✨ Yes! Our image pixel converter is 100% FREE forever with no hidden costs. You can pixelate images of any size (up to 20MB) without any watermarks, limitations, or registration requirements. All pixel art conversion happens in your browser, so there are no server costs or subscription fees.'
        }
      },
      {
        '@type': 'Question',
        name: 'Do I need to create an account or login to use this tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '🔓 No login or registration required! You can start using our pixel art converter immediately without creating any account. Simply visit the website and start converting your images to pixel art - it\'s that simple and completely anonymous.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my privacy protected when using the tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: '🛡️ Absolutely! Our image pixel converter works entirely in your browser with ZERO data uploaded to any server. Your images never leave your device, and no data is stored or tracked. This ensures complete privacy while providing professional-quality pixelation results.'
        }
      },
      {
        '@type': 'Question',
        name: 'What is an image to pixel art converter and how does it work?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An image to pixel art converter transforms regular digital photos into retro-style pixel art. Our FREE Image Pixelator uses advanced algorithms to reduce image resolution while preserving key visual elements, creating authentic pixel art perfect for game sprites, retro designs, and creative projects - all without requiring any login or payment.'
        }
      },
      {
        '@type': 'Question',
        name: 'What image formats are supported and are there any limitations?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our FREE pixel art maker supports all major image formats including JPG, PNG, and WebP for both input and output. Files up to 20MB are supported with no watermarks or quality restrictions. The tool maintains the quality of your original image while transforming it into stunning pixel artwork.'
        }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  );
}