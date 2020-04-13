import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import SwitchToggle from '../../components/switch-toggle/index.vue';
import Card from '../../components/card/index.vue';
import { ServerConnection } from '../../utilities/server';

@Component({
	name: 'SettingsPage',
	components: {
		Card,
		SwitchToggle
	},
	subscriptions(this: SettingsPage) {
		return {
			darkMode: this.store.select('config', 'ui_config', 'darkmode'),
			autoBrightness: this.store.select('config', 'settings', 'autobrightness'),
			autoSoftwareUpdate: this.store.select('config', 'settings', 'softwareupdate', 'autoUpdate'),
			entities: this.store.select('config', 'entities')
		};
	}
})
export default class SettingsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public get languageButtonText() {
		return `Language: ${this.$i18n.locale}`;
	}

	public onLanguageSelected($event: Event, locale: string) {
		$event.stopPropagation();
		this.$i18n.locale = locale;
	}

	public updateDarkMode(value: boolean) {
		this.server.setDarkMode(value);
	}

	public updateAutoBrightness(value: boolean) {
		this.server.setAutoBrightness(value);
	}

	public updateAutoSoftwareUpdate(value: boolean) {
		alert('TODO: API ENDPOINT NEEDED');
	}
}
