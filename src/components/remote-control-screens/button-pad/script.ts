import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator';
import { IRemoteFeature, IButtonConfig } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';
import IrButton from '../ir-button/index.vue';

@Component({
	name: 'ButtonPad',
	components: {
		ActionIconButton,
		IrButton
	}
})
export default class ButtonPad extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public config: IRemoteFeature;

	@Prop({
		type: String,
		required: false,
		default: 'center'
	})
	public alignment: string;

	@Emit('onButtonSelected')
	public onButtonSelected(button: IButtonConfig) {
		return button;
	}

	@Emit('onRemoved')
	public onRemove() {
		return this.config;
	}
}
