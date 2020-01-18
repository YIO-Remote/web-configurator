import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';
import { IIntegration } from '../../../types';
import { YioStore } from '../../../store';
import { Inject } from '../../../utilities/dependency-injection';

@Component({
	name: 'IntegrationSettings',
	components: {
		ActionButton
	}
})
export default class IntegrationSettings extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
	public updatedSettings = {};

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

	@Watch('integration', { deep: true, immediate: true })
	public onIntegrationChange(value: IIntegration) {
		if (value) {
			this.updatedSettings = Object.assign({}, value.data[0].data);
		}
	}

	public get hasIntegrationSelected() {
		return !!this.integration;
	}

	public get integrationName() {
		return this.integration.data[0].friendly_name;
	}

	public onSave() {
		this.store.dispatch(this.store.actions.updateIntegration(this.integration, this.integration.data[0].id));
		this.onCancel();
	}
}
