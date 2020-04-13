import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import ActionButton from '../../action-button/index.vue';
import ActionIconButton from '../../action-icon-button/index.vue';
import { IKeyValuePair } from '../../../types';
import { ServerConnection } from '../../../utilities/server';

@Component({
	name: 'AddIntegration',
	components: {
		ActionButton,
		ActionIconButton
	}
})
export default class AddIntegration extends Vue {
	@Prop({
		type: Object,
		required: false
	})
	public setupData: object;

	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public isAddingNewIntegration: boolean = false;
	public name: string = '';
	public type: string = '';
	public data: Array<{ key: string, value: string }> = [];
	public newDataKey: string = '';
	public newDataValue: string = '';

	public onAddNewSetting() {
		if (this.newDataKey && this.newDataValue) {
			this.data.push({ key: this.newDataKey, value: this.newDataValue });
		}

		this.newDataKey = '';
		this.newDataValue = '';
	}

	public onAddNewIntegration() {
		this.isAddingNewIntegration = true;
	}

	public onCancel() {
		this.isAddingNewIntegration = false;
		this.name = '';
		this.type = '';
		this.data = [];
	}

	public onSave() {
		if (!this.name) {
			return;
		}

		if (!this.type) {
			return;
		}

		this.isAddingNewIntegration = false;
		this.server.addIntegration({
			type: this.type,
			friendly_name: this.name,
			id: this.type,
			data: this.data.reduce((dataObj, item) => ({
				...dataObj,
				...{
					[`${item.key}`]: item.value
				}
			}), {} as IKeyValuePair<string>)
		});
		// this.store.dispatch(this.store.actions.addIntegration({
		// 	data: [{
		// 		friendly_name: this.name,
		// 		id: this.type,
		// 		data: this.data.reduce((dataObj, item) => ({
		// 			...dataObj,
		// 			...{
		// 				[`${item.key}`]: item.value
		// 			}
		// 		}), {} as IKeyValuePair<string>)
		// 	}]
		// }, this.name.toLowerCase().trim().replace(/\s/g, '')));
	}
}
