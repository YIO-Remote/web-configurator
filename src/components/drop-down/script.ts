import Vue from 'vue';
import { Component, Prop, Emit, Watch } from 'vue-property-decorator';
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
		required: false,
		default: () => ({})
	})
	public selectedItem: IDropDownItem;
	public isOpen: boolean = false;
	public options: IDropDownItem[] = [];
	public selected: IDropDownItem = {} as IDropDownItem;
	public displayMessage: string;

	public created() {
		this.setOptions();
		this.selected = this.options.find((option) => option.value === this.selectedItem.value) || this.options[0];
	}

	public mounted() {
		if (this.selected.value === this.selectedItem.value) {
			this.onChanged(this.selected);
			this.isOpen = false;
		}

		document.addEventListener('click', (event) => {
			if (event.target === null) {
				this.isOpen = false;
			}

			if (!this.$el.contains(event.target as Node)) {
				this.isOpen = false;
			}
		});
	}

	@Watch('items')
	public setOptions() {
		const displayMessage = this.message || this.$t('common.pleaseSelect').toString();

		this.options = [
			{ text: displayMessage, value: '-1' },
			...this.items,
		];
	}

	public isSelected(item: IDropDownItem) {
		return item.value === this.selected.value;
	}

	public onToggle() {
		this.isOpen = !this.isOpen;
	}

	public resetSelection(item?: IDropDownItem) {
		if (!item) {
			this.onChanged(this.options[0], false);
		} else {
			this.onChanged(this.options.find((option) => option.value === item.value) || this.options[0], false);
		}
	}

	@Emit('onChanged')
	public onChanged(item: IDropDownItem, toggle: boolean = true) {
		if (toggle) {
			this.onToggle();
		}

		this.selected = item;
		return item;
	}
}
