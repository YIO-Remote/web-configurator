import Vue from "vue";
import {Component, Prop} from "vue-property-decorator";

@Component({
	name: "TabContainer"
})
export default class TabContainer extends Vue {
	@Prop({
		type: Number,
		required: false,
		default: 0
	})
	public initialIndex: number;

	public tabs: Vue[] = [];

	public created() {
		this.tabs = this.$children;
	}

	public mounted() {
		(this.tabs[this.initialIndex] as any).setIsActive(true);
	}

	public selectTab(selectedTab: Vue) {
		this.tabs.forEach((tab) => {
			(tab as any).setIsActive(selectedTab === tab);
		});
	}
}
