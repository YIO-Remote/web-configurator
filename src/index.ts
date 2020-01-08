import 'core-js/es';
import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRx from 'vue-rx';
import VueI18n from 'vue-i18n';
import i18n from './i18n';
import MenuPlugin from './utilities/menu-plugin';
import YioApp from './yio-app/index.vue';
import { Router } from './router';
import { DIContainer } from './utilities/dependency-injection';
import { ServerConnection } from './utilities/server';

Vue.use(VueRx);
Vue.use(VueRouter);
Vue.use(MenuPlugin);
Vue.use(VueI18n);

const server = DIContainer.resolve(ServerConnection);
server.connect();
const app = new Vue({
	i18n,
	el: '#app',
	router: new Router(),
	render: (h) => h(YioApp)
});

app.$mount();
