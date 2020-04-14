import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import { IKeyValuePair, IDropDownItem } from '../../../types';
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
	public supportedIntegrations: IKeyValuePair<object>;
	public integrationTypeSelected: boolean = false;
	public typeOptions: IDropDownItem[] = [];
	public id: string = '';
	public name: string = '';
	public type: string = '';
	public fields: any = {};
	public newDataKey: string = '';
	public newDataValue: string = '';

	public mounted() {
		this.typeOptions = Object.keys(this.supportedIntegrations).map((key) => ({
			text: key,
			value: key
		}));
	}

	public onIntegrationTypeChanged(item: IDropDownItem) {
		this.integrationTypeSelected = true;
		this.type = item.value;
		this.fields = { ...this.supportedIntegrations[item.value] };
		delete this.fields.id;
		delete this.fields.entity_id;
		delete this.fields.friendly_name;
	}

	public onAddNewIntegration() {
		this.isAddingNewIntegration = true;
	}

	public onCancel() {
		this.isAddingNewIntegration = false;
		this.id = '';
		this.name = '';
		this.type = '';
		this.fields = {};
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
			data: this.fields
		}).then(() => this.onCancel());
	}
}
