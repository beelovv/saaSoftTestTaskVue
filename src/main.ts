import { createApp } from 'vue'

import { createPinia } from 'pinia'

import 'vuetify/dist/vuetify.css'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


import App from './App.vue'
import { useIndexStore } from './stores'
const vuetify = createVuetify({
    components,
    directives,
    icons: {
        defaultSet: 'mdi', // This is already the default value - only for display purposes
    },
})

const pinia = createPinia()
const app = createApp(App)

app.use(vuetify)
app.use(pinia)

const indexStore = useIndexStore()
indexStore.loadFieldsFromStorage()

app.mount('#app')