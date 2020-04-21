import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import ITabContainer from '../../tabs/tab-container/script';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';
import CardList from '../../card-list/index.vue';
import SmallCard from '../../small-card/index.vue';

@Component({
	name: 'ProfileOptions',
	components: {
		TabContainer,
		Tab,
		CardList,
		SmallCard
	},
	subscriptions(this: ProfileOptions) {
		return {
			entities: this.store.entities.loaded$,
			groupedEntities: this.store.entities.loadedGroupedByIntegration$,
			groups: this.store.groups.all$,
			pages: this.store.pages.all$
		};
	}
})
export default class ProfileOptions extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	public selectTab(index: number) {
		const tabs = this.$refs.tabs as ITabContainer;
		tabs.selectTab(index);
	}

	public mounted() {
		console.log((this as any).groups);
	}
}
