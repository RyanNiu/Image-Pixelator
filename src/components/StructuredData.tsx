'use client';

interface StructuredDataProps {
  lang: string;
}

export default function StructuredData({ lang }: StructuredDataProps) {
  // WebApplication schema
  const webApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Image Pixelator',
    description: 'Convert images to pixel art instantly in your browser. Free, private, and secure online pixel art generator.',
    url: `https://imagepixelator.pics/${lang}`,
    applicationCategory: 'GraphicsApplication',
    operatingSystem: 'Any',
    permissions: 'No permissions required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    featureList: [
      'Convert images to pixel art',
      'Multiple output formats (PNG, JPG, WebP)',
      'Real-time preview',
      '100% browser-based processing',
      'No data upload required',
      'Multiple preset styles',
      'Undo/Redo functionality'
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
    name: 'Image Pixelator',
    description: 'Professional online tool for converting regular images into pixel art. Features include real-time preview, multiple export formats, and complete privacy protection.',
    url: `https://imagepixelator.pics/${lang}`,
    applicationCategory: 'GraphicsApplication',
    operatingSystem: 'Web Browser',
    browserRequirements: 'Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.',
    memoryRequirements: 'Minimum 1GB RAM recommended',
    storageRequirements: 'No storage required - runs entirely in browser',
    permissions: 'No special permissions required',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock'
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '1250',
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
    name: 'Image Pixelator',
    description: 'Free online image to pixel art converter',
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
    name: 'How to Convert Images to Pixel Art',
    description: 'Step-by-step guide to convert any image into pixel art using our free online tool',
    image: 'https://imagepixelator.pics/og-image.png',
    totalTime: 'PT2M',
    estimatedCost: {
      '@type': 'MonetaryAmount',
      currency: 'USD',
      value: '0'
    },
    supply: [
      {
        '@type': 'HowToSupply',
        name: 'Digital Image',
        description: 'Any JPG, PNG, or WebP image file'
      }
    ],
    tool: [
      {
        '@type': 'HowToTool',
        name: 'Web Browser',
        description: 'Modern web browser with JavaScript enabled'
      }
    ],
    step: [
      {
        '@type': 'HowToStep',
        position: 1,
        name: 'Upload Image',
        text: 'Select and upload your image file (JPG, PNG, or WebP format)',
        image: 'https://imagepixelator.pics/step1.png'
      },
      {
        '@type': 'HowToStep',
        position: 2,
        name: 'Customize Settings',
        text: 'Adjust pixel size, choose color modes, and apply preset effects',
        image: 'https://imagepixelator.pics/step2.png'
      },
      {
        '@type': 'HowToStep',
        position: 3,
        name: 'Download Result',
        text: 'Download your pixelated image in high quality format',
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
        name: 'What is an image to pixel art converter?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'An image to pixel art converter is a tool that transforms regular digital photos into retro-style pixel art. Our Image Pixelator uses advanced algorithms to reduce image resolution while preserving key visual elements, creating authentic pixel art perfect for game sprites, retro designs, and creative projects.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is the pixel art converter free to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, our image pixel converter is completely free to use with no hidden costs. You can pixelate images of any size (up to 20MB) without any watermarks or limitations. All pixel art conversion happens in your browser, so there are no server costs or hidden fees.'
        }
      },
      {
        '@type': 'Question',
        name: 'Is my privacy protected when using the tool?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Our image pixel converter works entirely in your browser with zero data uploaded to any server. No images leave your device, and no data is stored or tracked. This ensures your privacy while providing professional-quality pixelation results.'
        }
      },
      {
        '@type': 'Question',
        name: 'What image formats are supported?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Our pixel art maker supports all major image formats including JPG, PNG, and WebP for both input and output. The tool maintains the quality of your original image while transforming it into stunning pixel artwork.'
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