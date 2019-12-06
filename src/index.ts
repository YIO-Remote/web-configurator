import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRx from 'vue-rx';
import VueI18n from 'vue-i18n'
import i18n from './i18n';
import MenuPlugin from './utilities/menu-plugin';
import {Router} from './router';
import YioApp from './yio-app/index.vue';

Vue.use(VueRx)
Vue.use(VueRouter);
Vue.use(MenuPlugin);
Vue.use(VueI18n);

const app = new Vue({
    i18n,
    el: '#app',
    router: new Router(),
    render: (h) => h(YioApp)
});

app.$mount();
