import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Drag } from 'vue-drag-drop';
import Draggable from 'vuedraggable';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { IPageAggregate, IGroupAggregate } from '../../../types';
import { ServerConnection } from '../../../server';
import ITabContainer from '../../tabs/tab-container/script';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';
import CardList from '../../card-list/index.vue';
import SmallCard from '../../small-card/index.vue';
import TextInput from '../../text-input/index.vue';
import Icon from '../../icon/index.vue';

@Component({
	name: 'ProfileOptions',
	components: {
		TabContainer,
		Tab,
		CardList,
		SmallCard,
		Drag,
		Draggable,
		TextInput,
		Icon
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

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public newPageName: string = '';
	public newGroupName: string = '';
	public pagesDragOptions = {
		disabled: false,
		sort: false,
		animation: 200,
		ghostClass: 'ghost',
		group: {
			name: 'pages',
			pull: 'clone',
			put: false
		}
	};
	public entitiesDragOptions = {
		disabled: false,
		sort: false,
		animation: 200,
		ghostClass: 'ghost',
		group: {
			name: 'entities',
			pull: 'clone',
			put: false
		}
	};
	public groupsDragOptions = {
		disabled: false,
		sort: false,
		animation: 200,
		ghostClass: 'ghost',
		group: {
			name: 'groups',
			pull: 'clone',
			put: false
		}
	};

	public selectTab(index: number) {
		const tabs = this.$refs.tabs as ITabContainer;
		tabs.selectTab(index);
	}

	public getIconType(page: IPageAggregate) {
		return (page.id === 'favorites' || page.id === 'settings') ? '' : 'delete';
	}

	public onAddNewPage(name: string) {
		this.server.addNewPage(name).then(() => this.newPageName = '');
	}

	public onDeletePage(page: IPageAggregate) {
		this.server.deletePage(page);
	}

	public onAddNewGroup(name: string) {
		this.server.addNewGroup(name).then(() => this.newGroupName = '');
	}

	public onDeleteGroup(group: IGroupAggregate) {
		this.server.deleteGroup(group);
	}
}
