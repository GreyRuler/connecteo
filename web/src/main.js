import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
import { createPinia } from 'pinia'
import ResizeTextarea from 'resize-textarea-vue3'
import VueSmoothScroll from 'vue-smooth-scroll'

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(ResizeTextarea)
app.use(VueSmoothScroll)
app.mount('#app')