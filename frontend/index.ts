import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

console.log(import.meta.env.APP_API_URL)

createApp(App).mount('#app')
