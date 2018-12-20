import Vue from 'vue'
import Vuetify from 'vuetify'
import DaySpanVuetify from 'dayspan-vuetify'
import VueRx from 'vue-rx'
Vue.use(VueRx)
import 'vuetify/dist/vuetify.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import App from './App.vue'
import 'dayspan-vuetify/dist/lib/dayspan-vuetify.min.css'
import 'rxjs'

import * as Database from './components/heroes/state/Database.js'
import router from './router'
Database.init()

Vue.config.productionTip = false

Vue.use(Vuetify)

Vue.use(DaySpanVuetify, {
  methods: {
    getDefaultEventColor: () => '#1976d2'
  }
})
Promise.all([
  // load things before vue startup
  Database.init()
]).then(() => {
  return new Vue({
    el: '#app',
    router,
    render: h => h(App)
  })
})
