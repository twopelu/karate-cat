import enUS from './labels/en-US.js';

const dictionaries = {
  'en-US': enUS
};

let currentLocale = 'en-US';

export function setLocale(locale) {
  if (dictionaries[locale]) {
    currentLocale = locale;
  }
}

export function t(key) {
  return dictionaries[currentLocale][key] ?? key;
}
