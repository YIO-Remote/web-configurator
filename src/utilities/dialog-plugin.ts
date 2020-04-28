import { VueConstructor } from 'vue';
// import Dialog from '../components/dialog/index.vue';
import { IDialogPlugin, IDialogOptions } from '../types';

export default class DialogPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		// const attachToDocument = (dialog: Dialog) => {
		// 	document.appendChild(dialog.$el);
		// };

		Vue.prototype.$dialog = {
			info(options: IDialogOptions) {
				if (!options.showButtons) {
					return Promise.resolve(true);
				}
				// if (this.instance && element) {
				// 	this.instance.$destroy();
				// 	this.instance.$el.remove();
				// }

				// const Component = Vue.extend(component);
				// this.instance = new Component({ propsData, parent: root });
				// this.instance.$mount();
				// this.isVisible = true;

				// if (!element) {
				// 	this.instance.$destroy();
				// 	return;
				// }

				// element.appendChild(this.instance.$el);
			}
		} as IDialogPlugin;
	}
}
