import Vue from 'vue';
import { Component, Ref } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfileAggregate, ICardListComponent, IPageAggregate } from '../../types';
import { ServerConnection } from '../../server';
import Draggable, { IDragEndEvent } from 'vuedraggable';
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
		Draggable
	},
	subscriptions(this: ProfilesPage) {
		return {
			profiles: this.store.profiles.profiles$,
			allPages: this.store.pages.all$
		};
	}
})
export default class ProfilesPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public profiles: IProfileAggregate[];
	public allPages: IPageAggregate[];
	public selectedProfile: IProfileAggregate = {} as IProfileAggregate;
	public selectedPage: IPageAggregate = {} as IPageAggregate;
	public remoteScreenComponent: string = '';
	public remoteScreenComponentProps: object = {};
	public newProfileName: string = '';
	public isDraggedOver: boolean = false;
	public tabs: TabContainer;
	public pages: IPageAggregate[];
	public dropZoneList: IPageAggregate[] = [];
	public pagesDragOptions = {
		disabled: false,
		sort: true,
		animation: 200,
		group: {
			name: 'pages',
			pull: 'clone',
			put: false
		}
	};
	public dropZoneOptions = {
		disabled: false,
		sort: false,
		group: 'pages'
	};

	@Ref('pageCardList')
	public readonly pageCardList!: ICardListComponent | ICardListComponent[];

	public get isPageSelected() {
		return !!this.selectedPage.id;
	}

	public get isFavoritesPageSelected() {
		return this.isPageSelected ? this.selectedPage.id === 'favorites' : false;
	}

	public get isSettingsPageSelected() {
		return this.isPageSelected ? this.selectedPage.id === 'settings' : false;
	}

	public get remoteMessage() {
		return !this.isPageSelected ?
			this.$t('pages.profiles.remote.defaultMessage') :
			this.isSettingsPageSelected ? this.$t('pages.profiles.remote.editSettingsMessage') : '';
	}

	public getBadgeClasses(isSelected: boolean) {
		return {
			badge: true,
			selected: isSelected
		};
	}

	public onProfileSelected(profile: IProfileAggregate, index: number) {
		if (index === -1) {
			this.selectedProfile = {} as IProfileAggregate;
			this.selectedPage = {} as IPageAggregate;
			this.$menu.hide();
			return;
		}

		this.$menu.show(this.$root, ProfileOptions, {});
		this.tabs = this.$menu.getComponent<TabContainer>();
		this.selectedProfile = profile;
		(Array.isArray(this.pageCardList) ? this.pageCardList : [this.pageCardList]).forEach((list) => list.deselect());
		this.server.setActiveProfile(profile);
	}

	public onPageSelected(page: IPageAggregate, index: number) {
		if (index === -1) {
			this.selectedPage = {} as IPageAggregate;
			return;
		}

		this.selectedPage = page;

		if (this.selectedPage.id === 'favorites') {
			this.tabs.selectTab(2);
		} else {
			this.tabs.selectTab(1);
		}
	}

	public createNewProfile() {
		alert(1);
	}

	public onDragOver() {
		this.isDraggedOver = true;
	}

	public onDragLeave() {
		this.isDraggedOver = false;
	}

	public onPageDropped(event: IDragEndEvent) {
		this.dropZoneList = [];
		const pageId = event.item.getAttribute('data-id');
		const matchingPage = this.allPages.find((page) => page.id === pageId);

		if (matchingPage) {
			this.server.addPageToProfile(this.selectedProfile, matchingPage);
		}

		this.isDraggedOver = false;
	}

	public onRemovePage(pageToRemove: IPageAggregate) {
		this.selectedPage = {} as IPageAggregate;
		this.server.removePageFromProfile(this.selectedProfile, pageToRemove.id);
	}

	public onPageSortOrderChanged(event: IDragEndEvent) {
		this.server.updatePageSortOrder(this.selectedProfile, event.oldDraggableIndex, event.newDraggableIndex);
	}

	public updated() {
		if (!this.selectedProfile.id) {
			return;
		}

		if (this.selectedProfile.id) {
			this.selectedProfile = this.profiles.find((profile) => profile.id === this.selectedProfile.id) as IProfileAggregate;

			if (!this.isPageSelected) {
				return;
			}

			if (this.selectedPage.id !== 'favorites') {
				this.selectedPage = this.selectedProfile.pages.find((page) => page.id === this.selectedPage.id) as IPageAggregate;
			}
		}
	}

	public beforeDestroy() {
		this.selectedProfile = {} as IProfileAggregate;
		this.selectedPage = {} as IPageAggregate;
		this.$menu.hide();
	}
}
