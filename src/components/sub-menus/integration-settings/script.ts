import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { YioStore } from '../../../store';
import { Inject } from '../../../utilities/dependency-injection';
import { ServerConnection } from '../../../server';
import { IIntegrationInstance, IKeyValuePair, IIntegrationSchema } from '../../../types';
import ActionButton from '../../action-button/index.vue';

@Component({
	name: 'IntegrationSettings',
	components: {
		ActionButton
	},
	subscriptions(this: IntegrationSettings) {
		return {
			supportedIntegrations: this.store.integrations.supported$
		};
	}
})
export default class IntegrationSettings extends Vue {
	@Prop({
		type: Object,
		required: false
	})
	public integration: IIntegrationInstance;

	@Prop({
		type: Object,
		required: false
	})
	public schema: IKeyValuePair<string>;

	@Prop({
		type: Function,
		required: false
	})
	public onCancel: () => void;

	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public supportedIntegrations: IKeyValuePair<IIntegrationSchema>;
	public properties: IKeyValuePair<IIntegrationSchema> = {};
	public propertyValues: IKeyValuePair<string> = {};

	public get name() {
		return this.integration.friendly_name;
	}

	public mounted() {
		const selectedIntegration = this.supportedIntegrations[this.integration.type];
		const properties = selectedIntegration.properties || {};
		const filteredProps = Object.keys(properties)
			.filter((key) => key !== 'entity_id' && key !== 'access_token')
			.reduce((values, propName) => {
				return {
					...values,
					[`${propName}`]: properties[propName]
				};
			}, {} as IKeyValuePair<IIntegrationSchema>);

		this.properties = { ...filteredProps };
		this.propertyValues = { ...Object.keys(filteredProps)
			.filter((key) => key !== 'entity_id' && key !== 'access_token')
			.reduce((values, propName) => {
			return {
				...values,
				[`${propName}`]: this.integration.data[propName]
			};
		}, {} as IKeyValuePair<string>) };
	}

	public onSave() {
		const config = {
			...this.integration,
			data: this.propertyValues
		};

		this.server.updateIntegration(config).then(() => this.onCancel());
	}
}
