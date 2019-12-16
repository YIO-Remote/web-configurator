import Vue from "vue";
import { Component, Emit, Prop } from "vue-property-decorator";

@Component({
	name: "ActionButton"
})
export default class ActionButton extends Vue {
	@Prop({
		required: true
	})
	public text: string;

	@Prop({
		default: true
	})
	public primary: boolean;

	@Emit("onClick")
	public onClick($event: Event) {
		$event.stopPropagation();
	}
}
