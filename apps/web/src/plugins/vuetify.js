import Vue from 'vue';
import Vuetify from 'vuetify/lib';
// import 'vuetify/src/stylus/app.styl';
import 'vuetify/dist/vuetify.min.css';
import 'vuetify/src/styles/main.sass';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify, {
  iconfont: 'mdi',
  options: {
    customProperties: true,
  },
});
