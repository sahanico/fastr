// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import router from '@/router/router';
import underscore from 'vue-underscore';
// import DatetimePicker from 'vuetify-datetime-picker';
import Vuetify from 'vuetify';
import vco from 'v-click-outside';
import 'vuetify/dist/vuetify.min.css';
// import 'vuetify/src/styles/main.sass';
import 'material-design-icons-iconfont/dist/material-design-icons.css';
import '@mdi/font/css/materialdesignicons.css';
// import './plugins/vuetify';
import VueYouTubeEmbed from 'vue-youtube-embed';
import App from './App';
import store from './store';
import titleMixin from './mixins/titleMixin';

Vue.use(vco);

Vue.use(Vuetify);

Vue.use(underscore);
Vue.use(VueYouTubeEmbed);
// Vue.use(DatetimePicker);
Vue.mixin(titleMixin);
Vue.config.productionTip = false;
Vue.prototype.eventbus = new Vue();

/* eslint-disable no-new */
new Vue({
  vuetify: new Vuetify({ iconfont: 'mdi' }),
  router,
  store,
  render: h => h(App),
}).$mount('#app');

