import { translations } from '../i18n/translations.js';

export class I18nManager {
  constructor() {
    this.translations = translations;
    this.currentLanguage = this.detectLanguage();
  }

  /**
   * Detect user's preferred language
   */
  detectLanguage() {
    // Check URL path first
    const pathLang = window.location.pathname.split('/')[1];
    if (this.translations[pathLang]) {
      return pathLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.translations[browserLang]) {
      return browserLang;
    }

    // Default to English
    return 'en';
  }

  /**
   * Get translation for key
   */
  t(key) {
    return this.translations[this.currentLanguage]?.[key] || 
           this.translations['en'][key] || 
           key;
  }

  /**
   * Change language
   */
  setLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      this.updatePageTexts();
      this.updateLanguageSelector();
    }
  }

  /**
   * Update all translatable elements on page
   */
  updatePageTexts() {
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      
      if (element.tagName === 'INPUT' && element.type === 'submit') {
        element.value = translation;
      } else if (element.tagName === 'OPTION') {
        element.textContent = translation;
      } else {
        element.textContent = translation;
      }
    });

    // Update page title and meta
    document.title = this.getLocalizedTitle();
    this.updateMetaTags();
  }

  /**
   * Get localized page title
   */
  getLocalizedTitle() {
    const titles = {
      en: "Image Pixelator - Free Online Pixel Art Tool | Multi-language",
      zh: "图像像素化工具 - 免费在线像素艺术生成器 | 多语言支持",
      es: "Pixelador de Imágenes - Herramienta Gratuita de Arte Pixel | Multi-idioma"
    };
    return titles[this.currentLanguage] || titles.en;
  }

  /**
   * Update meta tags for SEO
   */
  updateMetaTags() {
    const descriptions = {
      en: "Convert images to pixel art instantly in your browser! No upload required, pure frontend processing, free and privacy-friendly.",
      zh: "在浏览器中即时将图片转换为像素艺术！无需上传，纯前端处理，免费且保护隐私。",
      es: "¡Convierte imágenes a arte pixel instantáneamente en tu navegador! No requiere subida, procesamiento frontend puro, gratis y privado."
    };

    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.content = descriptions[this.currentLanguage] || descriptions.en;
    }
  }

  /**
   * Update language selector
   */
  updateLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
      selector.value = this.currentLanguage;
    }
  }

  /**
   * Initialize i18n system
   */
  init() {
    this.updatePageTexts();
    this.updateLanguageSelector();
    this.setupLanguageSelector();
  }

  /**
   * Setup language selector event
   */
  setupLanguageSelector() {
    const selector = document.getElementById('languageSelect');
    if (selector) {
      selector.addEventListener('change', (e) => {
        this.setLanguage(e.target.value);
      });
    }
  }

  /**
   * Show localized error message
   */
  showError(errorKey) {
    const message = this.t(errorKey);
    alert(message); // Simple alert for now, can be enhanced with custom modal
  }
}