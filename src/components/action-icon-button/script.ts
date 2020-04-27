import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';

@Component({
	name: 'ActionIconButton'
})
export default class ActionIconButton extends Vue {
	@Prop({
		type: String,
		default: 'delete'
	})
	public type: string;

	@Emit('onClick')
	public onClick($event: Event) {
		$event.stopPropagation();
	}
}
