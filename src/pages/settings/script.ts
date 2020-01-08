import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import SwitchToggle from '../../components/switch-toggle/index.vue';
import Card from '../../components/card/index.vue';

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
			autoSoftwareUpdate: this.store.select('config', 'settings', 'softwareupdate'),
			entities: this.store.select('config', 'entities')
		};
	}
})
export default class SettingsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	public get languageButtonText() {
		return `Language: ${this.$i18n.locale}`;
	}

	public onLanguageSelected($event: Event, locale: string) {
		$event.stopPropagation();
		this.$i18n.locale = locale;
	}

	public updateDarkMode(value: boolean) {
		this.store.dispatch(this.store.actions.updateDarkMode(value, false));
	}

	public updateAutoBrightness(value: boolean) {
		this.store.dispatch(this.store.actions.updateAutoBrightness(value, false));
	}

	public updateAutoSoftwareUpdate(value: boolean) {
		this.store.dispatch(this.store.actions.updateAutoSoftwareUpdate(value, false));
	}
}
