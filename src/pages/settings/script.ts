import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import SwitchToggle from '../../components/switch-toggle/index.vue';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';


@Component({
    name: 'SettingsPage',
    components: {
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

    public toggleLanguage() {
        if (this.$i18n.locale === 'en_US') {
            this.$i18n.locale = 'nl_NL';
        } else {
            this.$i18n.locale = 'en_US';
        }
    }

    public updateDarkMode(value: boolean) {
        this.store.dispatch(this.store.actions.updateConfig({
            ...this.store.value.config,
            ...{
                ui_config: {
                    ...this.store.value.config.ui_config,
                    darkmode: value
                }
            }
        }, false));
    }

    public updateAutoBrightness(value: boolean) {
        this.store.dispatch(this.store.actions.updateConfig({
            ...this.store.value.config,
            ...{
                settings: {
                    ...this.store.value.config.settings,
                    autobrightness: value
                }
            }
        }, false));
    }

    public updateAutoSoftwareUpdate(value: boolean) {
        this.store.dispatch(this.store.actions.updateConfig({
            ...this.store.value.config,
            ...{
                settings: {
                    ...this.store.value.config.settings,
                    softwareupdate: value
                }
            }
        }, false));
    }
};