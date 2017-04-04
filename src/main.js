// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

var VueMaterial = require('vue-material')
var VueResource = require('vue-resource')
Vue.use(VueMaterial)
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.http.options.root = 'https://stanley.elfstack.com/wp-json/wp/v2'

Vue.material.registerTheme('default', {
  primary: 'teal',
  warn: 'teal'
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
