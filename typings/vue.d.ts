import Vue, { VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { IContextMenu, IToastOptions } from '../src/types';

declare module 'vue/types/vue' {
  	// tslint:disable-next-line:interface-name
  	interface Vue {
		$menu: IContextMenu;
		$toast: {
			open: (options: IToastOptions) => void,
			success: (message: string, options?: IToastOptions) => void,
			error: (message: string, options?: IToastOptions) => void,
			info: (message: string, options?: IToastOptions) => void,
			warning: (message: string, options?: IToastOptions) => void,
			clear: () => void
		};
	}
}
