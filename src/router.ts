import { createRouter, createWebHistory } from 'vue-router'

const routeAnchor = { render: () => null }

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'catalogue', component: routeAnchor },
    { path: '/leagues/:id', name: 'league', component: routeAnchor },
    { path: '/:pathMatch(.*)*', redirect: { name: 'catalogue' } },
  ],
})
