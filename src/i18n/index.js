import { createI18n } from 'vue-i18n'

import uk from './uk.json'
import en from './en.json'

const savedLocale =
  localStorage.getItem('locale') || 'uk'

//створення об'єкту мультиязичності
export const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'en',
  messages: {
    uk,
    en
  }
})