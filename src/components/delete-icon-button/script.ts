import Vue from 'vue';
import { Component, Emit } from 'vue-property-decorator';

@Component({
	name: 'DeleteButton'
})
export default class DeleteButton extends Vue {
	@Emit('onClick')
	public onClick($event: Event) {
		$event.stopPropagation();
	}
}
