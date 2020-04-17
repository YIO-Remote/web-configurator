import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import { IKeyValuePair, IDropDownItem, IIntegrationSchema } from '../../../types';
import ActionButton from '../../action-button/index.vue';
import ActionIconButton from '../../action-icon-button/index.vue';
import DropDown from '../../drop-down/index.vue';

@Component({
	name: 'AddIntegration',
	subscriptions(this: AddIntegration) {
		return {
			supportedIntegrations: this.store.integrations.supported
		};
	},
	components: {
		ActionButton,
		ActionIconButton,
		DropDown
	}
})
export default class AddIntegration extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public isAddingNewIntegration: boolean = false;
	public supportedIntegrations: IKeyValuePair<IIntegrationSchema>;
	public integrationTypeSelected: boolean = false;
	public typeOptions: IDropDownItem[] = [];
	public id: string = '';
	public name: string = '';
	public type: string = '';
	public properties: IKeyValuePair<IIntegrationSchema> = {};
	public propertyValues: IKeyValuePair<string> = {};
	public newDataKey: string = '';
	public newDataValue: string = '';

	public mounted() {
		this.typeOptions = Object.keys(this.supportedIntegrations).map((key) => ({
			text: key,
			value: key
		}));
	}

	public onIntegrationTypeChanged(item: IDropDownItem) {
		const selectedIntegration = this.supportedIntegrations[item.value];
		const properties = selectedIntegration.properties || {};
		this.integrationTypeSelected = true;
		this.type = item.value;
		this.properties = { ...properties };
		this.propertyValues = { ...Object.keys(properties).reduce((values, propName) => {
			return {
				...values,
				[`${propName}`]: ''
			};
		}, {} as IKeyValuePair<string>) };
	}

	public onAddNewIntegration() {
		this.isAddingNewIntegration = true;
	}

	public onCancel() {
		this.isAddingNewIntegration = false;
		this.id = '';
		this.name = '';
		this.type = '';
		this.properties = {};
		this.propertyValues = {};
	}

	public onSave() {
		if (!this.id) {
			return;
		}

		if (!this.name) {
			return;
		}

		if (!this.type) {
			return;
		}

		this.server.addIntegration({
			id: this.id,
			type: this.type,
			friendly_name: this.name,
			data: this.propertyValues
		}).then(() => this.onCancel());
	}
}
