import Vue, { VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { IContextMenu, IToastPlugin, IDialogPlugin } from '../src/types';

// tslint:disable:interface-name
declare module 'vue/types/vue' {
  	interface Vue {
		$dialog: IDialogPlugin;
		$toast: IToastPlugin;
		$menu: IContextMenu;
	}

	  interface VueConstructor {
		$toast: IToastPlugin;
	}
}
