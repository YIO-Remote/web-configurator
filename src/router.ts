import VueRouter from "vue-router";
import IntegrationsPage from "./pages/integrations/index.vue";
import EntitiesPage from "./pages/entities/index.vue";
import ProfilesPage from "./pages/profiles/index.vue";
import SettingsPage from "./pages/settings/index.vue";
import IRLearningPage from "./pages/ir-learning/index.vue";
import SoftwareUpdatePage from "./pages/update/index.vue";

export class Router extends VueRouter {
	constructor() {
		super({
			routes: [
				{
					path: "/",
					redirect: { path: "/integrations" }
				},
				{
					name: "Integrations",
					path: "/integrations",
					component: IntegrationsPage
				},
				{
					name: "Entities",
					path: "/entities",
					component: EntitiesPage
				},
				{
					name: "Profiles",
					path: "/profiles",
					component: ProfilesPage
				},
				{
					name: "Settings",
					path: "/settings",
					component: SettingsPage
				},
				{
					name: "IR Learning",
					path: "/ir-learning",
					component: IRLearningPage
				},
				{
					name: "Software Update",
					path: "/update",
					component: SoftwareUpdatePage
				}
			]
		});
	}
}
