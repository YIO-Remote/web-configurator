import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';
import { IIntegration, IKeyValuePair } from '../../../types';
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
	public updatedSettings: IKeyValuePair<string> = {};

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

	public get name() {
		return this.integration.data[0].friendly_name;
	}

	public get settings() {
		return { ...this.integration.data[0].data };
	}

	public mounted() {
		this.updatedSettings = { ...this.integration.data[0].data };
	}

	public onSave() {
		const updatedIntegration: IIntegration = {
			...this.integration,
			...{
				data: [{
					...this.integration.data[0],
					data: this.updatedSettings,
				}]
			}
		};

		this.store.dispatch(this.store.actions.updateIntegration(updatedIntegration, this.integration.data[0].id));
		this.onCancel();
	}
}
