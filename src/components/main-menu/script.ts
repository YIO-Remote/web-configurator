import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Router } from '../../router';

@Component({
	name: 'MainMenu'
})
export default class MainMenu extends Vue {
	public get routes() {
		return Router.routes.filter((route) => route.path !== '/');
	}
}
