import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionButton from '../action-button/index.vue';

@Component({
	name: 'Dialog',
	components: {
		ActionButton
	}
})
export default class DisconnectedOverlay extends Vue {
	@Prop({
		type: String,
		required: true
	})
	public title: string;

	@Prop({
		type: String,
		required: true
	})
	public message: string;

	@Prop({
		type: Boolean,
		required: false,
		default: true
	})
	public showButtons: boolean;
	public resolve: (value: boolean) => void;

	public created() {
		// tslint:disable-next-line:no-unused-expression
		new Promise((resolve) => this.resolve = resolve);
	}

	public onButtonClick(isConfirm: boolean) {
		this.resolve(isConfirm);
	}
}
