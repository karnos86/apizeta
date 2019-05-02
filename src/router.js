import Vue from 'vue'
import Router from 'vue-router'
import User from './views/User.vue'
import Edition from './views/Edition.vue'
import Pay from './views/Pay.vue'
import Membership from './views/Membership.vue'
import User_Details from './views/User_Details.vue'
import Pay_Details from './views/Pay_Details.vue'
import Login from './views/Login.vue'
import App from './App.vue'


Vue.use(Router)

function requireAuth (to, from, next) {

  if (!localStorage.cookie){
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
  } else {
    next()
  }
}

function logout(){
  delete localStorage.cookie
  location.reload();
  this.requireAuth();

}

export default new Router({
  mode: '',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/user',
      name: 'user',
      component: User,
      beforeEnter: requireAuth 
    },
    {
      path: '/edition',
      name: 'edition',
      component: Edition,
      beforeEnter: requireAuth 
    },
    {
      path: '/pay',
      name: 'pay',
      component: Pay,
      props:true,
      beforeEnter: requireAuth 
    },
    {
      path: '/membership',
      name: 'membership',
      component: Membership,
      beforeEnter: requireAuth 
    },
    {
      path: '/details_user/',
      name: 'details_user',
      component: User_Details, 
      props:true,
      beforeEnter: requireAuth 
    },
    {
      path: '/details_pay/',
      name: 'details_pay',
      component: Pay_Details, 
      props:true,
      beforeEnter: requireAuth 
    },
    {
      path: '/login',
      name: 'login',
      component: Login, 
    },
    {
      path: '/', 
      name: '',  
      component: App },

    { 
      path: '/logout', 
      name: 'logout', 
      beforeEnter: 
      logout  
    }

    
  ]
})
