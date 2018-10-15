import Vue from 'vue'
import Router from 'vue-router'
import Finder from './views/Finder.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Finder',
      component: Finder
    },
    {
      path: '/settings',
      name: 'Settings',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "settings" */ './views/Settings.vue')
    },
    {
      path: '/copy',
      name: 'Copy',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "copy" */ './views/Copy.vue')
    },
    {
      path: '/slides',
      name: 'Slides',
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import(/* webpackChunkName: "slides" */ './views/Slides.vue')
    }
  ]
})
