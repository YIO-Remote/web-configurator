import Vue, { VueConstructor } from 'vue';
import { IMenuPlugin } from '../types';

export default class MenuPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.prototype.$menu = Vue.observable({
			instance: void 0,

			isVisible: false,

			show<T extends object>(component: VueConstructor<Vue>, propsData?: T) {
				const element = document.getElementById('sub-menu');

				if (this.instance && element) {
					this.instance.$destroy();
					this.instance.$el.remove();
				}

				const Component = Vue.extend(component);
				this.instance = new Component({ propsData });
				this.instance.$mount();
				this.isVisible = true;

				if (!element) {
					this.instance.$destroy();
					return;
				}

				element.appendChild(this.instance.$el);
			},

			hide() {
				this.isVisible = false;
			},

			getComponent<T extends Vue>(): T {
				return this.instance;
			}
		} as IMenuPlugin);
	}
}
