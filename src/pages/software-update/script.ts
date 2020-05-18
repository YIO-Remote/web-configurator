import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { ServerConnection } from '../../server';
import SwitchToggle from '../../components/switch-toggle/index.vue';
import Card from '../../components/card/index.vue';
import ActionButton from '../../components/action-button/index.vue';

@Component({
	name: 'SettingsPage',
	components: {
		Card,
		SwitchToggle,
		ActionButton
	},
	subscriptions(this: SoftwareUpdatePage) {
		return {
			autoSoftwareUpdate: this.store.select('config', 'settings', 'softwareupdate', 'autoUpdate')
		};
	}
})
export default class SoftwareUpdatePage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public isNewVersionAvailable: boolean = false;

	public get message() {
		return this.isNewVersionAvailable ?
			this.$t('pages.softwareUpdate.newAvailable') :
			this.$t('pages.softwareUpdate.upToDate');
	}

	public updateAutoSoftwareUpdate(value: boolean) {
		this.server.setAutoUpdate(value);
	}

	public checkForUpdate() {
		this.server.checkForUpdate();
	}

	public update() {
		console.log('TODO: API ENDPOINT NEEDED');
	}
}
