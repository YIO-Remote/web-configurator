import Vue, { VueConstructor } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { IContextMenu } from '../src/types';

declare module 'vue/types/vue' {
  	// tslint:disable-next-line:interface-name
  	interface Vue {
		$menu: IContextMenu;
	}
}
