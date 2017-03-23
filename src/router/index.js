import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Post from '@/components/Post'
import NotFound from '@/components/NotFound'
Vue.use(Router)

export default new Router({
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
      if (savedPosition) {
          return savedPosition
      } else {
          return { x: 0, y: 0 }
      }
  },
  routes: [
  {
      path: '/',
      name: 'Home',
      component: Home,

  },
  {
      path: '/category/:categoryName/id/:categoryId',
      name: 'Category',
      component: Home
  },
  {
      path:'/post/:postId',
      name: 'Post',
      component: Post
  },
  {
      path:'/about',
      name: 'About',
      component: resolve => require(['@/components/About'], resolve)
  },
  {
      path:'/search/:term',
      name: 'Search',
      component: resolve => require(['@/components/Search'], resolve)
  },
  {
      path:'/settings',
      name: 'Settings',
      component: resolve => require(['@/components/Settings'], resolve)
  },
  {
      path: '*',
      name: 'NotFound',
      component: NotFound,
  }
  ]
})
