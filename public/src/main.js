import Vue from 'vue'
import VueRouter from 'vue-router'
import VueToastr2 from 'vue-toastr-2'
import 'vue-toastr-2/dist/vue-toastr-2.min.css'
import VModal from 'vue-js-modal'
 

 
window.toastr = require('toastr')
 
Vue.use(VModal,{ dialog: true })
Vue.use(require('vue-moment'));
Vue.use(VueToastr2)
Vue.use(VueRouter)

/*
*Framework Bulma
**/
require('./assets/mystyles.scss')
/*
*	Components
**/
import auth from './authy'
import App from './components/App.vue'
import Membership from './components/Membership.vue'
import Newspaper from './components/Newspaper.vue'
import Pay from './components/Pay.vue'
import User from './components/User.vue'
import Login from './components/Login.vue'
import bus from './bus.js'

function requireAuth (to, from, next) {
  if (!auth.loggedIn()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

const router = new VueRouter({
  mode: 'history',
  base: __dirname,
  routes: [
    { path: '/membership', component: Membership, beforeEnter: requireAuth  },
    { path: '/newspaper', component: Newspaper, beforeEnter: requireAuth },
    { path: '/pay', component: Pay, beforeEnter: requireAuth },
    { path: '/users', component: User, beforeEnter: requireAuth },
    { path: '/login', component: Login },
    { path: '/logout',
      beforeEnter (to, from, next) {
        bus.$emit("out");
        next('/')
      }
    }
  ]
})

new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
