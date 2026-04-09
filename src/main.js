import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import './style.css'
import router from './router'
import App from './App.vue'

const app = createApp(App)

app.config.errorHandler = (err) => {
  const div = document.createElement('div')
  div.style = 'position:fixed;top:20px;left:20px;z-index:9999;background:white;color:red;padding:20px;border:2px solid red;'
  div.innerText = 'Runtime Error: ' + err.message
  document.body.appendChild(div)
}

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(ElementPlus)
app.use(router)
app.mount('#app')
console.log('Vue application mounted successfully!')
