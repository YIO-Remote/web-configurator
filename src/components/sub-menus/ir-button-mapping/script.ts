import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IButtonConfig } from '../../../types';
import TextInput from '../../text-input/index.vue';
import ActionButton from '../../action-button/index.vue';
import SwitchToggle from '../../switch-toggle/index.vue';
import Icon from '../../icon/index.vue';

@Component({
	name: 'IrButtonMapping',
	components: {
		SwitchToggle,
		ActionButton,
		TextInput,
		Icon
	}
})
export default class IrButtonMapping extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public button: IButtonConfig;

	public onToggled(button: IButtonConfig, value: boolean) {
		console.log(value);
		button.enabled = value;
	}

	public onRecord(button: IButtonConfig) {
		alert('LEARN COMMAND FOR ' + button.feature);
	}
}
