import Vue, { VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { IContextMenu, IToastOptions, IToast, IDialogPlugin } from '../src/types';

// tslint:disable:interface-name
declare module 'vue/types/vue' {
  	interface Vue {
		$dialog: IDialogPlugin;
		$menu: IContextMenu;
		$toast: IToast;
	}

	  interface VueConstructor {
		$toast: IToast;
	}
}
