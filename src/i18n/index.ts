import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './languages'

i18n
  .use(initReactI18next)
  .init({
    debug: false,
    lng: 'en-US',
    fallbackLng: 'en-US',
    interpolation: {
      escapeValue: false,
    },
    resources,
  })

export default i18n
