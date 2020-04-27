import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { ServerConnection } from '../../server';
import { map } from 'rxjs/operators';

@Component({
	name: 'DisconnectedOverlay',
	subscriptions(this: DisconnectedOverlay) {
		return {
			isDisconnected: this.server.isConnected$.pipe(map((isConnected) => !isConnected))
		};
	}
})
export default class DisconnectedOverlay extends Vue {
	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public loadingDots: string = '';

	public mounted() {
		window.setInterval(() => {
			if (this.loadingDots.length === 4) {
				this.loadingDots = '';
			} else {
				this.loadingDots += '.';
			}
		}, 500);
	}
}
