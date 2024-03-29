import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';
import { ITabComponent } from '../../../types';

@Component({
	name: 'TabContainer'
})
export default class TabContainer extends Vue {
	@Prop({
		type: Number,
		required: false,
		default: 0
	})
	public initialIndex: number;

	public $children: ITabComponent[];

	public tabs: ITabComponent[] = [];

	public created() {
		this.tabs = this.$children;
	}

	public mounted() {
		this.tabs[this.initialIndex].setIsActive(true);
	}

	public selectTab(selectedTab: Vue | number) {
		this.tabs.forEach((tab, index) => {
			const isSelected = (typeof selectedTab === 'number') ? index === selectedTab : selectedTab === tab;
			tab.setIsActive(isSelected);
		});
	}
}
