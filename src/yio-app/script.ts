import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { distinctUntilChanged } from 'rxjs/operators';
import MainMenu from '../components/main-menu/index.vue';
import { Inject } from '../utilities/dependency-injection';
import { ServerConnection } from '../server';

@Component({
	name: 'YioApp',
	components: {
		MainMenu
	}
})
export default class YioApp extends Vue {
	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public previousHeight: string | null;

	public mounted() {
		this.$subscribeTo(this.server.isConnected$.pipe(distinctUntilChanged()), (isConnected) => {
			if (!isConnected) {
				this.$dialog.info({
					title: this.$t('dialogs.disconnection.title').toString(),
					message: this.$t('dialogs.disconnection.message').toString(),
					showButtons: false
				});
			} else {
				this.$dialog.close();
			}
		});
	}

	public beforeLeave(element: HTMLElement) {
		this.previousHeight = getComputedStyle(element).height;
	}

	public enter(element: HTMLElement) {
		const { height } = getComputedStyle(element);
		element.style.height = this.previousHeight as string;
		setTimeout(() => element.style.height = height);
	}

	public afterEnter(element: HTMLElement) {
		element.style.height = '100%';
	}

	public get version() {
		return process.env.__VERSION__;
	}
}
