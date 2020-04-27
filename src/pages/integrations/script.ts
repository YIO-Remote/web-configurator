import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IIntegrationInstance, IKeyValuePair, IYioTableComponent } from '../../types';
import { ServerConnection } from '../../server';
import YioTable from '../../components/table/index.vue';
import ActionIconButton from '../../components/action-icon-button/index.vue';
import IntegrationSettings from '../../components/sub-menus/integration-settings/index.vue';
import AddIntegration from '../../components/sub-menus/add-integration/index.vue';

@Component({
	name: 'IntegrationsPage',
	components: {
		YioTable,
		ActionIconButton
	},
	subscriptions(this: IntegrationsPage) {
		return {
			integrations: this.store.integrations.configured$,
			supportedIntegrations: this.store.integrations.supported$
		};
	}
})
export default class IntegrationsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public integrations: IKeyValuePair<IIntegrationInstance>;
	public supportedIntegrations: IKeyValuePair<object>;

	public mounted() {
		this.$menu.show(this.$root, AddIntegration, {});
	}

	public onItemSelected(index: number) {
		const integration = this.integrations[index];
		const schema = this.supportedIntegrations[integration.type];

		this.$menu.show(this.$root, IntegrationSettings, {
			integration,
			schema,
			onCancel: this.onItemDeselected
		});
	}

	public onItemDeselected() {
		this.$menu.show(this.$root, AddIntegration, {});
		(this.$refs.table as IYioTableComponent).deselect();
	}

	public onItemDeleted(item: IIntegrationInstance) {
		this.server.removeIntegration(item.id);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
