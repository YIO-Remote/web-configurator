import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Router } from '../../router';
import { Inject } from '../../utilities/dependency-injection';

@Component({
	name: 'MainMenu'
})
export default class MainMenu extends Vue {
	@Inject(() => Router)
	private router: Router;

	public get routes() {
		return this.router.routes.filter((route) => {
			if (!route.meta) {
				return true;
			}
			return !route.meta.excludeFromMenu;
		});
	}
}
