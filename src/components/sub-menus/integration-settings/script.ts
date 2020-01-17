import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';
import { IIntegration } from '../../../types';

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
	public integration: IIntegration;

	@Prop({
		type: Function,
		required: false
	})
	public onCancel: () => void;

	public get hasIntegrationSelected() {
		return !!this.integration;
	}

	public get integrationName() {
		return this.integration.data[0].friendly_name;
	}

	public get settings() {
		if (!this.integration.data[0].data) {
			return [];
		}

		return Object.keys(this.integration.data[0].data).map((key) => {
			return {
				fieldName: key,
				fieldValue: this.integration.data[0].data[key]
			};
		});
	}

	public onSave() {
		alert(`Save settings for --> ${this.integration.data[0].friendly_name}`);
		this.onCancel();
	}
}
