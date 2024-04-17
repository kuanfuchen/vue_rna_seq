import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// 
import '@fortawesome/fontawesome-free/css/all.css';
import { aliases, fa } from 'vuetify/iconsets/fa';
// createApp(App).use(router).mount('#app')
// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'fa',
    aliases,
    sets: {
      fa,
    },
  },
})

createApp(App).use(router).use(vuetify).mount('#app')