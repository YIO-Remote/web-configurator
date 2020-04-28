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
}
