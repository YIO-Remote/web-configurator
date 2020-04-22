import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfileAggregate, ICardListComponent, IPageAggregate } from '../../types';
import CardList from '../../components/card-list/index.vue';
import Card from '../../components/card/index.vue';
import SmallCard from '../../components/small-card/index.vue';
import ProfileOptions from '../../components/sub-menus/profile-options/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import ActionButton from '../../components/action-button/index.vue';
import EditFavorites from '../../components/remote-control-screens/edit-favorites/index.vue';
import EditPage from '../../components/remote-control-screens/edit-page/index.vue';
import TabContainer from '../../components/tabs/tab-container/script';

@Component({
	name: 'ProfilesPage',
	components: {
		CardList,
		Card,
		SmallCard,
		RemoteControl,
		ActionButton,
		EditFavorites,
		EditPage
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
	public selectedProfile: IProfileAggregate = {} as IProfileAggregate;
	public remoteScreenComponent: string = '';
	public remoteScreenComponentProps: object = {};
	public newProfileName: string = '';
	public tabs: TabContainer;

	@Ref('pageCardList')
	public readonly pageCardList!: ICardListComponent | ICardListComponent[];

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
			this.selectedProfile = {} as IProfileAggregate;
			this.$menu.hide();
			this.deselectRemoteComponent();
			return;
		}

		this.$menu.show(ProfileOptions, {});
		this.tabs = this.$menu.getComponent<TabContainer>();
		this.selectedProfile = this.profiles[index];
		this.deselectRemoteComponent();
		(Array.isArray(this.pageCardList) ? this.pageCardList : [this.pageCardList]).forEach((list) => list.deselect());
	}

	public onPageSelected(index: number) {
		if (index === -1) {
			this.deselectRemoteComponent();
			return;
		}

		// Favorites - is not a standard page
		if (index === 0) {
			this.onEditFavorites();
			return;
		}

		this.onEditPage(this.selectedProfile.pages[index--]);
	}

	public onEditFavorites() {
		this.tabs.selectTab(2);
		this.setRemoteComponent('EditFavorites', {
			favorites: this.selectedProfile.favorites
		});
	}

	public onEditPage(page: IPageAggregate) {
		this.tabs.selectTab(1);
		this.setRemoteComponent('EditPage', {
			page
		});
	}

	public setRemoteComponent(componentName: string, componentProps: object) {
		this.remoteScreenComponent = componentName;
		this.remoteScreenComponentProps = componentProps;
	}

	public deselectRemoteComponent() {
		this.remoteScreenComponent = '';
		this.remoteScreenComponentProps = {};
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
