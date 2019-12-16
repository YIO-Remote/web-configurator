import Vue, { VueConstructor } from "vue";

export default class MenuPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.prototype.$menu = Vue.observable({
			component: void 0,
			props: void 0,

			show<T extends object>(component: VueConstructor<Vue>, propsObject?: T) {
				this.component = component as any;
				this.props = propsObject || {} as any;
			},

			hide() {
				this.component = void 0;
				this.props = void 0;
			},
		});
	}
}
