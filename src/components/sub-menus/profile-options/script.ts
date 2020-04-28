import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Drag } from 'vue-drag-drop';
import Fuse from 'fuse.js';
import Draggable from 'vuedraggable';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { IPageAggregate, IGroupAggregate, IKeyValuePair, IEntityAggregate } from '../../../types';
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

	public entities: IEntityAggregate[];
	public groupedEntities: IKeyValuePair<IEntityAggregate[]>;
	public filteredGroupedEntities: IKeyValuePair<IEntityAggregate[]> = {};
	public entitySearchName: string = '';
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

	public mounted() {
		this.filteredGroupedEntities = this.groupedEntities;
		this.onFilterChanged();
	}

	public selectTab(index: number) {
		const tabs = this.$refs.tabs as ITabContainer;
		tabs.selectTab(index);
	}

	public getIconType(page: IPageAggregate) {
		return (page.id === 'favorites' || page.id === 'settings') ? '' : 'delete';
	}

	public onFilterChanged() {
		console.log(this.entitySearchName);
		if (!this.entitySearchName) {
			this.filteredGroupedEntities = this.groupedEntities;
			return;
		}

		const fuse = new Fuse(this.entities, {
			keys: ['friendly_name'],
			threshold: 0.3
		});

		const results = fuse.search<IEntityAggregate>(this.entitySearchName).map((result) => result.item);
		this.filteredGroupedEntities = results.reduce((groups, entity) => {
			groups[entity.type] = groups[entity.type] || [];
			groups[entity.type].push(entity);
			return groups;
		}, {} as IKeyValuePair<IEntityAggregate[]>);
	}

	public onAddNewPage(name: string) {
		this.server.addNewPage(name).then(() => this.newPageName = '');
	}

	public onDeletePage(page: IPageAggregate) {
		this.$dialog.warning({
			title: this.$t('dialogs.deletePage.title').toString(),
			message: this.$t('dialogs.deletePage.message', { name: page.name }).toString(),
			showButtons: true
		}).then(() => this.server.deletePage(page));
	}

	public onAddNewGroup(name: string) {
		this.server.addNewGroup(name).then(() => this.newGroupName = '');
	}

	public onDeleteGroup(group: IGroupAggregate) {
		this.$dialog.warning({
			title: this.$t('dialogs.deleteGroup.title').toString(),
			message: this.$t('dialogs.deleteGroup.message', { name: group.name }).toString(),
			showButtons: true
		}).then(() => this.server.deleteGroup(group));
	}
}
