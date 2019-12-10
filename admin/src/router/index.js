import Vue from 'vue'
import VueRouter from 'vue-router'
import DomainEvent from '../views/DomainEvent.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'domainevent',
    component: DomainEvent
  },
  {
    path: '/eventtracker',
    name: 'eventtracker',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/EventTracker.vue')
  },
  {
    path: '/warntracker',
    name: 'warntracker',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/WarnTracker.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
