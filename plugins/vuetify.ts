// import this after install `@mdi/font` package
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'
import { createVuetify } from 'vuetify'
const customDarkTheme = {
  dark: false,
  colors: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    "admin-layout": "#FFFFFF",
    "surface-bright": "#FFFFFF",
    "surface-light": "#EEEEEE",
    "surface-variant": "#424242",
    "on-surface-variant": "#EEEEEE",
    //buttons color
    primary: "#1867C0",
    "btn-delete": "#B71C1C",
    "btn-edit-1": "#018786",
    "btn-edit-2": "#FBC02D",
    "btn-back-1": "#BDBDBD",

    "progress-circular": "#F5F5F5",
    secondary: "#48A9A6",
    "secondary-darken-1": "#018786",
    error: "#B00020",
    info: "#2196F3",
    success: "#4CAF50",
    warning: "#FB8C00",
  },
}
export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: "customDarkTheme",
      themes: {
        customDarkTheme,
      },
    },
  })
  app.vueApp.use(vuetify)
})
