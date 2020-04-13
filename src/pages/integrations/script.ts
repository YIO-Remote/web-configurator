import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject, DIContainer } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IIntegrationInstance, IKeyValuePair, IYioTableComponent } from '../../types';
import { ServerConnection } from '../../utilities/server';
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
			integrations: this.store.integrations.configured
		};
	},
	beforeRouteEnter(_, __, next) {
		const server = DIContainer.resolve(ServerConnection);

		server.getSupportedIntegrations().then((integrations) => {
			return integrations.reduce((chain, integration) => {
				return chain.then((previous) => {
					return server.getIntegrationSetupData(integration).then((setupData) => {
						previous[integration] = setupData;
						return previous;
					});
				});
			}, Promise.resolve({} as IKeyValuePair<any>));
		}).then((data) => next((vm: IntegrationsPage) => vm.setSetupData(data)));
	}
})
export default class IntegrationsPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public integrations: IKeyValuePair<IIntegrationInstance>;
	public schemas: IKeyValuePair<any>;

	public setSetupData(schemas: IKeyValuePair<any>) {
		this.schemas = schemas;
	}

	public mounted() {
		this.$menu.show(AddIntegration, {});
	}

	public onItemSelected(index: number) {
		const integration = this.integrations[index];
		const schema = this.schemas[integration.type];

		this.$menu.show(IntegrationSettings, {
			integration,
			schema,
			onCancel: this.onItemDeselected
		});
	}

	public onItemDeselected() {
		this.$menu.show(AddIntegration, {});
		(this.$refs.table as IYioTableComponent).deselect();
	}

	public onItemDeleted(item: IIntegrationInstance) {
		this.server.removeIntegration(item.id);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
