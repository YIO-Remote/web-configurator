import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	name: 'YioTable'
})
export default class YioTable extends Vue {
	@Prop({
		type: [Array, Object],
		required: true
	})
	public items: object[] | object;

	@Prop({
		type: Boolean,
		default: false
	})
	public disableSelection: boolean;

	@Prop({
		type: String,
		default: '100%'
	})
	public maxHeight: string;

	public selectedIndex: number = -1;

	public rowSelected(index: number) {
		if (this.disableSelection) {
			return;
		}

		if (this.selectedIndex === index) {
			this.selectedIndex = -1;
			this.$emit('onItemsDeselected', index);
			return;
		}

		this.selectedIndex = index;
		this.$emit('onItemSelected', index);
	}

	public deselect() {
		if (this.disableSelection) {
			return;
		}

		this.selectedIndex = -1;
	}
}
