import Vue from 'vue';
import { Component } from 'vue-property-decorator';
// import { map } from 'rxjs/operators';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IIntegration, IKeyValuePair } from '../../types';
import YioTable from '../../components/table/index.vue';
import ActionIconButton from '../../components/action-icon-button/index.vue';
import IntegrationSettings from '../../components/sub-menus/integration-settings/index.vue';
import AddIntegration from '../../components/sub-menus/add-integration/index.vue';

// tslint:disable:no-any
@Component({
	name: 'IntegrationsPage',
	components: {
		YioTable,
		ActionIconButton
	},
	subscriptions(this: IntegrationsPage) {
		return {
			configuredIntegrations: this.store.select('config', 'integrations')
		};
	}
})
export default class IntegrationsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	public configuredIntegrations: IKeyValuePair<IIntegration>;

	public mounted() {
		this.$menu.show(AddIntegration, {});
	}

	public onItemSelected(name: string) {
		this.$menu.show(IntegrationSettings, {
			integration: this.configuredIntegrations[name],
			onCancel: this.onItemDeselected
		});
	}

	public onItemDeselected() {
		this.$menu.show(AddIntegration, {});
	}

	public onItemDeleted(item: any) {
		alert(`TODO: Remove Entity --> ${item.data[0].friendly_name}`);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
