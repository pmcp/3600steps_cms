import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './registerServiceWorker'


import VueFire from 'vuefire';
Vue.use(VueFire);

// Buefy is a css framework and components library for Vue based on Bulma. (https://bulma.io & https://buefy.github.io)
import Buefy from 'buefy';
Vue.use(Buefy);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
