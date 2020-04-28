import Vue, { VueConstructor } from 'vue';

export default class DialogPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.prototype.$menu = Vue.observable({
			instance: void 0,

			isVisible: false,

			show<T extends object>(root: Vue, component: VueConstructor<Vue>, propsData?: T) {
				const element = document.getElementById('sub-menu');

				if (this.instance && element) {
					this.instance.$destroy();
					this.instance.$el.remove();
				}

				const Component = Vue.extend(component);
				this.instance = new Component({ propsData, parent: root });
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
		});
	}
}
