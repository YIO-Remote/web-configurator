import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Drag } from 'vue-drag-drop';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import ITabContainer from '../../tabs/tab-container/script';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';
import CardList from '../../card-list/index.vue';
import SmallCard from '../../small-card/index.vue';
import { IPageAggregate } from '../../../types';

@Component({
	name: 'ProfileOptions',
	components: {
		TabContainer,
		Tab,
		CardList,
		SmallCard,
		Drag
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

	public getIconType(page: IPageAggregate) {
		return (page.id === 'favorites' || page.id === 'settings') ? '' : 'delete';
	}
}
