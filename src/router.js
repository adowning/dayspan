import Vue from 'vue'
import Router from 'vue-router'
import home from './components/home.vue'
import profile from './components/profile/Profile.vue'
import heroes from './components/heroes/heroes.vue'
import login from './components/login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    // route level code-splitting
    // this generates a separate chunk (login.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    // component: () =>
    //   import(/* webpackChunkName: "login" */ './components/login.vue')
    // },
    {
      path: '/profile',
      name: 'profile',
      component: profile
    },
    {
      path: '/heroes',
      name: 'heroes',
      component: heroes
    }
    // component: () =>
    //   import(/* webpackChunkName: "profile" */ './components/profile/')
    // }
  ]
})
