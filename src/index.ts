import 'core-js';
import '../assets/styles/reset.scss';
import '../assets/styles/main.scss';
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/ayu-dark.css';
import 'codemirror/addon/fold/foldgutter.css';
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueRx from 'vue-rx';
import VueI18n from 'vue-i18n';
import VueDragDrop from 'vue-drag-drop';
import VueCodeMirror from 'vue-codemirror';
import 'codemirror/mode/javascript/javascript.js';
import 'codemirror/addon/fold/foldcode.js';
import 'codemirror/addon/fold/foldgutter.js';
import 'codemirror/addon/fold/brace-fold.js';
import 'codemirror/addon/fold/indent-fold.js';
import 'codemirror/addon/fold/comment-fold.js';
import PerfectScrollbar from 'vue2-perfect-scrollbar';
import MenuPlugin from './utilities/menu-plugin';
import DialogPlugin from './utilities/dialog-plugin';
import ToastPlugin from './utilities/toast-plugin';
import YioApp from './yio-app/index.vue';
import { Router } from './router';
import { Localisation } from './i18n';
import { DIContainer } from './utilities/dependency-injection';

Vue.use(VueDragDrop);
Vue.use(VueCodeMirror);
Vue.use(PerfectScrollbar);
Vue.use(VueRx);
Vue.use(VueRouter);
Vue.use(MenuPlugin);
Vue.use(ToastPlugin);
Vue.use(DialogPlugin);
Vue.use(VueI18n);

const i18n = new Localisation();
DIContainer.registerSingletonFactory(Localisation, () => i18n);
const app = new Vue({
	i18n,
	el: '#app',
	router: new Router(),
	render: (h) => h(YioApp)
});

app.$mount();
