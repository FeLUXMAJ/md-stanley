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
/*
stl:{50:"#e7dcce",100:"#b98477",200:"#cb4042",300:"#e7dcce",400:"#f1ebe3",500:"#994639",600:"#c7802d",
*/
Vue.material.registerTheme('default', {
  primary: {
    color: 'stl',
    hue: 200
  },
  warn: {
    color: 'stl',
    hue: 500
  }
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
