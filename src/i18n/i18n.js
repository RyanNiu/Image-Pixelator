import en from './translations/en.js';
import zh from './translations/zh.js';
import es from './translations/es.js';
import fr from './translations/fr.js';
import ru from './translations/ru.js';

const translations = {
  en,
  zh,
  es,
  fr,
  ru
};

export class I18nManager {
  constructor() {
    this.translations = translations;
    this.currentLanguage = this.detectLanguage();
    this.defaultLanguage = 'en';
  }

  detectLanguage() {
    // Check URL first - 这是最重要的，因为用户直接访问了特定语言的页面
    const urlLang = this.getLanguageFromURL();
    if (urlLang && this.translations[urlLang]) {
      console.log('Language detected from URL:', urlLang);
      return urlLang;
    }

    // Check localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang && this.translations[storedLang]) {
      console.log('Language detected from localStorage:', storedLang);
      return storedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.translations[browserLang]) {
      console.log('Language detected from browser:', browserLang);
      return browserLang;
    }

    // Default to English
    console.log('Using default language: en');
    return this.defaultLanguage;
  }

  getLanguageFromURL() {
    const path = window.location.pathname;
    // 匹配语言路径，支持有无尾随斜杠的情况
    const langMatch = path.match(/^\/(en|zh|es|fr|ru)(?:\/|$)/);
    if (langMatch) {
      console.log('Detected language from URL:', langMatch[1]);
      return langMatch[1];
    }
    return null;
  }

  getCurrentLanguage() {
    return this.currentLanguage;
  }

  changeLanguage(lang) {
    if (this.translations[lang]) {
      this.currentLanguage = lang;
      localStorage.setItem('language', lang);
      
      // Update URL to reflect language
      this.updateURLLanguage(lang);
      
      // Translate the page
      this.translatePage();
      
      // Dispatch language change event
      window.dispatchEvent(new CustomEvent('languageChanged', { detail: lang }));
    }
  }

  updateURLLanguage(lang) {
    const path = window.location.pathname;
    const origin = window.location.origin;
    
    // If already in a language path, replace it
    if (path.startsWith('/en/') || path.startsWith('/zh/') || path.startsWith('/es/') || path.startsWith('/fr/') || path.startsWith('/ru/')) {
      const newPath = path.replace(/^\/(en|zh|es|fr|ru)\//, `/${lang}/`);
      window.history.pushState({}, '', origin + newPath + window.location.search + window.location.hash);
    } else {
      // Add language prefix
      const pathWithoutLeadingSlash = path.startsWith('/') ? path.slice(1) : path;
      const newPath = `/${lang}/${pathWithoutLeadingSlash}`;
      window.history.pushState({}, '', origin + newPath + window.location.search + window.location.hash);
    }
  }

  translatePage() {
    // 只有当检测到的语言与当前页面语言不匹配时才进行翻译
    const urlLang = this.getLanguageFromURL();
    
    // 如果URL中的语言与当前语言匹配，说明页面已经是正确的语言版本
    if (urlLang && urlLang === this.currentLanguage) {
      console.log('Page is already in correct language:', urlLang);
      return;
    }
    
    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    console.log(`Translating ${elements.length} elements to ${this.currentLanguage}`);
    
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      const translation = this.t(key);
      if (translation) {
        if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
          element.placeholder = translation;
        } else {
          element.textContent = translation;
        }
      }
    });
  }

  t(key) {
    const translation = this.translations[this.currentLanguage][key] || 
                       this.translations[this.defaultLanguage][key] || 
                       key;
    return translation;
  }

  init() {
    // Set language in localStorage
    localStorage.setItem('language', this.currentLanguage);
    
    // Translate the page
    this.translatePage();
    
    // Listen for language changes
    window.addEventListener('languageChanged', (e) => {
      console.log('Language changed to:', e.detail);
    });
  }
}