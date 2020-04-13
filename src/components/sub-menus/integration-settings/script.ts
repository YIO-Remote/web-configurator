import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { YioStore } from '../../../store';
import { Inject } from '../../../utilities/dependency-injection';
import { ServerConnection } from '../../../utilities/server';
import { IIntegrationInstance, IKeyValuePair } from '../../../types';
import ActionButton from '../../action-button/index.vue';

@Component({
	name: 'IntegrationSettings',
	components: {
		ActionButton
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

	public updatedSettings: IKeyValuePair<string> = {};

	public get name() {
		return this.integration.friendly_name;
	}

	public mounted() {
		this.updatedSettings = { ...this.integration.data };
	}

	public get fields() {
		const clone = { ...this.schema };
		delete clone.id;
		delete clone.entity_id;
		delete clone.friendly_name;
		return clone;
	}

	public onSave() {
		const data = {
			...this.integration,
			data: this.updatedSettings
		};

		this.server.updateIntegration(data).then(() => this.onCancel());
	}
}
