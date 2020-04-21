import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfileAggregate, IPageAggregate } from '../../types';
import CardList from '../../components/card-list/index.vue';
import Card from '../../components/card/index.vue';
import SmallCard from '../../components/small-card/index.vue';
import ProfileOptions from '../../components/sub-menus/profile-options/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import ActionButton from '../../components/action-button/index.vue';
import TabContainer from '../../components/tabs/tab-container/script';

@Component({
	name: 'ProfilesPage',
	components: {
		CardList,
		Card,
		SmallCard,
		RemoteControl,
		ActionButton
	},
	subscriptions(this: ProfilesPage) {
		return {
			profiles: this.store.profiles.profiles$
		};
	}
})
export default class ProfilesPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
	public profiles: IProfileAggregate[];
	public selectedProfile?: IProfileAggregate;
	public selectedPage?: IPageAggregate;
	public newProfileName: string = '';
	public tabs: TabContainer;

	public get selectedProfileFavorites() {
		return this.selectedProfile ? this.selectedProfile.favorites : [];
	}

	public getBadgeClasses(isSelected: boolean) {
		return {
			badge: true,
			selected: isSelected
		};
	}

	public onProfileSelected(index: number) {
		if (index === -1) {
			this.selectedProfile = void 0;
			this.selectedPage = void 0;
			this.$menu.hide();
			return;
		}

		this.$menu.show(ProfileOptions, {});
		this.tabs = this.$menu.getComponent<TabContainer>();
		this.selectedProfile = this.profiles[index];
	}

	public onPageSelected(index: number) {
		// Ignore Favorites - its not a standard page
		if (index === 0) {
			this.onEditFavorites();
			return;
		}

		// Offset the index (as favorites skews it)
		index--;
		this.selectedPage = this.selectedProfile?.pages[index];
		this.onEditPage();
	}

	public onEditFavorites() {
		this.tabs.selectTab(2);
	}

	public onEditPage() {
		this.tabs.selectTab(0);
	}

	public buttonPress(side: string, direction: string) {
		alert(`You pressed the ${side} hand side button, ${direction}`);
	}

	public createNewProfile() {
		alert(1);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
