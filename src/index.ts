import 'core-js';
import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';
import 'vue-toast-notification/dist/theme-default.css';
import 'vue-toast-notification/dist/theme-sugar.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRx from 'vue-rx';
import VueI18n from 'vue-i18n';
import VueToast from 'vue-toast-notification';
import VueDragDrop from 'vue-drag-drop';
import AceEditor from 'vue-editor-ace';
import i18n from './i18n';
import MenuPlugin from './utilities/menu-plugin';
import YioApp from './yio-app/index.vue';
import { Router } from './router';

Vue.use(VueToast, { position: 'bottom' });
Vue.use(VueDragDrop);
Vue.use(AceEditor);
Vue.use(VueRx);
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
