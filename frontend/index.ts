import { createApp } from 'vue'
import { createVfm } from 'vue-final-modal'
import 'vue-final-modal/style.css'
import '~/assets/sass/index.scss'
import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'

const app = createApp(App)
const vfm = createVfm()
app.use(vfm)
app.use(Notifications)
app.mount('#app')
