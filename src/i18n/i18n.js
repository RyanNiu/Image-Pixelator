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
    // Check URL first
    const urlLang = this.getLanguageFromURL();
    if (urlLang && this.translations[urlLang]) {
      return urlLang;
    }

    // Check localStorage
    const storedLang = localStorage.getItem('language');
    if (storedLang && this.translations[storedLang]) {
      return storedLang;
    }

    // Check browser language
    const browserLang = navigator.language.split('-')[0];
    if (this.translations[browserLang]) {
      return browserLang;
    }

    // Default to English
    return this.defaultLanguage;
  }

  getLanguageFromURL() {
    const path = window.location.pathname;
    const langMatch = path.match(/^\/(en|zh|es|fr|ru)\//);
    return langMatch ? langMatch[1] : null;
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
    // Translate all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
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