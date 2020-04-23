import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfileAggregate, ICardListComponent, IPageAggregate } from '../../types';
import { Drop } from 'vue-drag-drop';
import { ServerConnection } from '../../server';
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
		EditPage,
		Drop
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
	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public profiles: IProfileAggregate[];
	public selectedProfileIndex: number = -1;
	public selectedPageIndex: number = -1;
	public remoteScreenComponent: string = '';
	public remoteScreenComponentProps: object = {};
	public newProfileName: string = '';
	public isDraggedOver: boolean = false;
	public tabs: TabContainer;
	public pages: IPageAggregate[];

	@Ref('pageCardList')
	public readonly pageCardList!: ICardListComponent | ICardListComponent[];

	public get selectedProfile() {
		return this.profiles[this.selectedProfileIndex];
	}

	public get selectedPage() {
		return this.selectedProfile.pages[this.selectedPageIndex];
	}

	public getBadgeClasses(isSelected: boolean) {
		return {
			badge: true,
			selected: isSelected
		};
	}

	public onProfileSelected(index: number) {
		if (index === -1) {
			this.selectedProfileIndex = -1;
			this.selectedPageIndex = -1;
			this.$menu.hide();
			this.deselectRemoteComponent();
			return;
		}

		this.$menu.show(ProfileOptions, {});
		this.tabs = this.$menu.getComponent<TabContainer>();
		this.selectedProfileIndex = index;
		this.deselectRemoteComponent();
		(Array.isArray(this.pageCardList) ? this.pageCardList : [this.pageCardList]).forEach((list) => list.deselect());
	}

	public onPageSelected(index: number) {
		if (index === -1) {
			this.deselectRemoteComponent();
			return;
		}

		this.selectedPageIndex = index;

		if (this.selectedPage.id === 'favorites') {
			this.tabs.selectTab(2);
			this.setRemoteComponent('EditFavorites', {
				favorites: this.selectedProfile.favorites
			});
			return;
		}

		this.tabs.selectTab(1);
		this.setRemoteComponent('EditPage', {
			page: this.selectedPage
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

	public createNewProfile() {
		alert(1);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}

	public onDragOver() {
		this.isDraggedOver = true;
	}

	public onDragLeave() {
		this.isDraggedOver = false;
	}

	public onPageDropped(droppedPage: IPageAggregate) {
		this.server.addPageToProfile(this.selectedProfile, droppedPage);
		this.isDraggedOver = false;
	}

	public onRemovePage(pageToRemove: IPageAggregate) {
		this.server.removePageFromProfile(this.selectedProfile, pageToRemove.id);
	}
}
