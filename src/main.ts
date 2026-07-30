import { createApp } from 'vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import App from './App.vue'
import { persistSportsDbQueries, sportsDbQueryClient } from './api/sportsDbQueryClient'
import { router } from './router'
import './style.css'

const app = createApp(App)
app.use(router)
app.use(VueQueryPlugin, {
  queryClient: sportsDbQueryClient,
  clientPersister: persistSportsDbQueries,
})

await router.isReady()
app.mount('#app')
