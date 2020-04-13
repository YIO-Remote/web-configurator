import Vue, { VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { IContextMenu, IToastOptions, IToast } from '../src/types';

declare module 'vue/types/vue' {
  	// tslint:disable:interface-name
  	interface Vue {
		$menu: IContextMenu;
		$toast: IToast;
	}

	  interface VueConstructor {
		$toast: IToast;
	}
}
