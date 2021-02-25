import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'landing-page',
      component: require('@/Index').default
    },
    {
      path: "/settings",
      name: 'settings',
      component: require('@/views/settings/Index').default
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
