import Vue, { VueConstructor } from 'vue';
import Toast from '../components/toast/index.vue';
import { IToastPlugin, IToastComponent } from '../types';

let $root: Vue;

export default class ToastPlugin {
	// tslint:disable-next-line: no-shadowed-variable
	public static install(Vue: VueConstructor) {
		Vue.mixin({
			beforeMount(this: Vue) {
				if (!$root) {
					$root = this.$root;
				}
			}
		});

		const container = document.createElement('div');
		container.className = 'toasts-container';
		document.body.appendChild(container);

		const attachToContainer = (dialog: Toast) => {
			dialog.$mount();
			container.appendChild(dialog.$el);
		};

		const show = (type: string, message: string, duration: number = 4000) => {
			const ToastConstructor = Vue.extend(Toast);
			const toast = new ToastConstructor({ propsData: { type, message }, parent: $root }) as IToastComponent;
			attachToContainer(toast);
			window.setTimeout(() => toast.hide().then(() => remove(toast)), duration);
			return toast;
		};

		const remove = (toast: Toast) => {
			toast.$destroy();
			toast.$el.remove();
		};

		Vue.$toast = Vue.prototype.$toast = {
			success(message: string, duration?: number) {
				show('success', message, duration);
			},
			info(message: string, duration?: number) {
				show('info', message, duration);
			},
			error(message: string, duration?: number) {
				show('warning', message, duration);
			}
		} as IToastPlugin;
	}
}
