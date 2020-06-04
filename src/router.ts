import VueRouter, { RouteConfig } from 'vue-router';
import IntegrationsPage from './pages/integrations/index.vue';
import EntitiesPage from './pages/entities/index.vue';
import ProfilesPage from './pages/profiles/index.vue';
import SettingsPage from './pages/settings/index.vue';
// import IRLearningPage from './pages/ir-learning/index.vue';
import SoftwareUpdatePage from './pages/software-update/index.vue';
import AdvancedPage from './pages/advanced/index.vue';
import { Inject, Singleton } from './utilities/dependency-injection';
import { ServerConnection } from './server';
import { Localisation } from './i18n';
import { YioStore } from './store';

@Singleton
export class Router extends VueRouter {
	@Inject(() => Localisation)
	public i18n: Localisation;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	@Inject(() => YioStore)
	public store: YioStore;

	public routes = [
		{
			path: '/',
			redirect: () => {
				return {
					name: 'menu.integrations'
				};
			},
			meta: {
				excludeFromMenu: true
			}
		},
		{
			name: 'menu.integrations',
			path: '/integrations/',
			component: IntegrationsPage
		},
		{
			name: 'menu.entities',
			path: '/entities',
			component: EntitiesPage
		},
		{
			name: 'menu.profiles',
			path: '/profiles',
			component: ProfilesPage
		},
		// TODO: NEED COMPLETED DESIGNS
		// {
		// 	name: 'menu.irLearning',
		// 	path: '/ir-learning',
		// 	component: IRLearningPage
		// },
		{
			name: 'menu.settings',
			path: '/settings',
			component: SettingsPage
		},
		// {
		// 	name: 'menu.softwareUpdate',
		// 	path: '/update',
		// 	component: SoftwareUpdatePage
		// },
		{
			name: 'menu.advanced',
			path: '/advanced',
			component: AdvancedPage
		}
	] as RouteConfig[];

	constructor() {
		super();
		this.addRoutes(this.routes);
		this.beforeEach((to, __, next) => {
			this.server.connect()
				.then(() => this.i18n.locale = this.store.value.config.settings.language)
				.then(() => next())
				.catch((e) => next(e));
		});
	}
}
