import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { ServerConnection } from '../../server';
import SwitchToggle from '../../components/switch-toggle/index.vue';
import Card from '../../components/card/index.vue';
import DropDown from '../../components/drop-down/index.vue';
import { ILanguageSetting, IDropDownItem } from '../../types';

@Component({
	name: 'SettingsPage',
	components: {
		Card,
		SwitchToggle,
		DropDown
	},
	subscriptions(this: SettingsPage) {
		return {
			darkMode: this.store.select('config', 'ui_config', 'darkmode'),
			autoBrightness: this.store.select('config', 'settings', 'autobrightness'),
			availableLanguages: this.store.select('settings', 'languages').pipe(
				map((languages) => languages.map((language) => ({ text: language.name, value: language.id })))
			),
			selectedLanguage: this.store.select('config', 'settings', 'language').pipe(
				map((selectedLanguageId) => this.store.value.settings.languages.find((language) => language.id === selectedLanguageId) as ILanguageSetting),
				map((selectedLanguage) => ({ text: selectedLanguage.name, value: selectedLanguage.id }))
			)
		};
	}
})
export default class SettingsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public selectedLanguage: IDropDownItem;

	public onLanguageSelected(language: IDropDownItem) {
		if (language.value === this.selectedLanguage.value) {
			return;
		}

		this.server.setLanguage(language.value);
		this.$i18n.locale = language.value;
	}

	public updateDarkMode(value: boolean) {
		this.server.setDarkMode(value);
	}

	public updateAutoBrightness(value: boolean) {
		this.server.setAutoBrightness(value);
	}
}
