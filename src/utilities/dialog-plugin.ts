import Vue, { VueConstructor } from 'vue';
import Dialog from '../components/dialog/index.vue';
import { IDialogPlugin, IDialogOptions, IDialogComponent } from '../types';

let $root: Vue;
let lastDialog: Dialog;

export default class DialogPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.mixin({
			beforeMount(this: Vue) {
				if (!$root) {
					$root = this.$root;
				}
			}
		});

		const attachToDocument = (dialog: Dialog) => {
			dialog.$mount();
			document.body.appendChild(dialog.$el);
		};

		const show = (type: string, propsData: IDialogOptions) => {
			if (lastDialog) {
				remove(lastDialog);
			}

			const DialogConstructor = Vue.extend(Dialog);
			const dialog = new DialogConstructor({ propsData: { ...propsData, type }, parent: $root }) as IDialogComponent;
			lastDialog = dialog;
			attachToDocument(dialog);
			return dialog;
		};

		const remove = (dialog: Dialog) => {
			dialog.$destroy();
			dialog.$el.remove();
		};

		Vue.prototype.$dialog = {
			info(options: IDialogOptions) {
				const dialog = show('info', options);

				return dialog.promise.then(() => remove(dialog)).catch(() => {
					remove(dialog);
					return Promise.reject();
				});
			},
			warning(options: IDialogOptions) {
				const dialog = show('warning', options);

				return dialog.promise.then(() => remove(dialog)).catch(() => {
					remove(dialog);
					return Promise.reject();
				});
			},
			close() {
				if (lastDialog) {
					remove(lastDialog);
				}
			}
		} as IDialogPlugin;
	}
}
