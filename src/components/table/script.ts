import Vue from "vue";
import { Component, Prop, Emit } from "vue-property-decorator";

@Component({
	name: "YioTable"
})
export default class YioTable extends Vue {
	@Prop({
		type: Array,
		required: true
	})
	public items: any[];

	public selectedIndex: number = -1;

	@Prop({
		type: String,
		default: "100%"
	})
	public maxHeight: string;

	public rowSelected(index: number) {
		if (this.selectedIndex === index) {
			this.selectedIndex = -1;
			this.$emit("onItemsDeselected", index);
			return;
		}

		this.selectedIndex = index;
		this.$emit("onItemSelected", index);
	}
}
