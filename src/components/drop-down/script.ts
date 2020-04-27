import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator';
import { IDropDownItem } from '../../types';

@Component({
	name: 'DropDown'
})
export default class DropDown extends Vue {
	@Prop({
		type: String,
		required: false
	})
	public message: string;

	@Prop({
		type: Array,
		required: true
	})
	public items: IDropDownItem[];

	@Prop({
		type: Object,
		required: false
	})
	public selectedItem?: IDropDownItem;
	public isOpen: boolean = false;
	public selected: IDropDownItem = this.selectedItem || this.options[0];

	public mounted() {
		document.addEventListener('click', (event) => {
			if (event.target === null) {
				this.isOpen = false;
			}

			if (!this.$el.contains(event.target as Node)) {
				this.isOpen = false;
			}
		});
	}

	public get options() {
		return [
			{ text: this.message, value: this.message },
			...this.items,
		];
	}

	public isSelected(item: IDropDownItem) {
		return item.value === this.selected.value;
	}

	public onToggle() {
		this.isOpen = !this.isOpen;
	}

	@Emit('onChanged')
	public onChanged(item: IDropDownItem) {
		this.onToggle();
		this.selected = item;
		return item;
	}
}
