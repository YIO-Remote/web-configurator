import Vue from 'vue';
import { Component, Emit, Prop } from 'vue-property-decorator';

@Component({
	name: 'DeleteButton'
})
export default class DeleteButton extends Vue {
	@Prop({
		required: true
	})
	public item: any;

	@Emit('onClick')
	public onClick($event: Event) {
		$event.stopPropagation();
		return this.item;
	}
}
