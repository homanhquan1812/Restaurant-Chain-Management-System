import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import en_customer from './en/customer.json'
import vi_customer from './vi/customer.json'
import en_dashboard from './en/dashboard.json'
import vi_dashboard from './vi/dashboard.json'
import en_product from './en/product.json'
import vi_product from './vi/product.json'
import en_order from './en/order.json'
import vi_order from './vi/order.json'
import en_common from './en/common.json'
import vi_common from './vi/common.json'
import en_settings from './en/settings.json'
import vi_settings from './vi/settings.json'
import en_reservations from './en/reservation.json'
import vi_reservations from './vi/reservation.json'
import vi_brand_branch from './vi/brand_branch.json'
import en_brand_branch from './en/brand_branch.json'
import vi_feedback from './vi/feedback.json'
import en_feedback from './en/feedback.json'
import vi_voucher from './vi/voucher.json'
import en_voucher from './en/voucher.json'
import vi_employee from './vi/employee.json'
import en_employee from './en/employee.json'
import vi_blog from './vi/blog.json'
import en_blog from './en/blog.json'

i18next.use(initReactI18next).init({
  lng: 'vi', 
  fallbackLng: "en",
  debug: true,
  resources: {
    en: {
      translation: {
        ...en_customer,
        ...en_dashboard,
        ...en_product,
        ...en_order,
        ...en_common,
        ...en_settings,
        ...en_reservations,
        ...en_brand_branch,
        ...en_feedback,
        ...en_voucher,
        ...en_employee,
        ...en_blog
      }
    },
    vi: {
      translation: {
        ...vi_customer,
        ...vi_dashboard,
        ...vi_product,
        ...vi_order,
        ...vi_common,
        ...vi_settings,
        ...vi_reservations,
        ...vi_brand_branch,
        ...vi_feedback,
        ...vi_voucher,
        ...vi_employee,
        ...vi_blog
      }
    }
  },
  interpolation: {
    escapeValue: false // React already does escaping
  }
  // if you see an error like: "Argument of type 'DefaultTFuncReturn' is not assignable to paraproduct of type xyz"
  // set returnNull to false (and also in the i18next.d.ts options)
  // returnNull: false,
})

export default i18next
