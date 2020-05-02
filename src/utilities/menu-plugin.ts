import Vue, { VueConstructor } from 'vue';
import { IMenuPlugin } from '../types';
import { Inject } from './dependency-injection';
import { Localisation } from '../i18n';

let $root: Vue;

export default class MenuPlugin {
	@Inject(() => Localisation)
	public static localisation: Localisation;

	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.mixin({
			beforeMount(this: Vue) {
				if (!$root) {
					$root = this.$root;
				}
			}
		});

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
				this.instance = new Component({ propsData, parent: $root });
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

			getComponent() {
				return this.instance;
			}
		} as IMenuPlugin);
	}
}
