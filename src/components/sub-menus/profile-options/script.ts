import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Drag } from 'vue-drag-drop';
import Draggable from 'vuedraggable';
import { map } from 'rxjs/operators';
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
		this.$subscribeTo(
			this.store.entities.generateFilterStream$(
				this.$watchAsObservable('entitySearchName').pipe(map((watcher) => watcher.newValue as string)),
				this.store.entities.loaded$.pipe(map((entities) => entities.filter((entity) => !!entity.integration))),
				['friendly_name', 'integration.friendly_name']
			).pipe(map((results) => {
				return results.reduce((groups, entity) => {
					groups[entity.integration.friendly_name_search_term] = groups[entity.integration.friendly_name_search_term] || [];
					groups[entity.integration.friendly_name_search_term].push(entity);
					return groups;
				}, {} as IKeyValuePair<IEntityAggregate[]>);
			})),
			(results) => this.filteredGroupedEntities = results);
	}

	public beforeDestroy() {
		this.entitySearchName = '';
	}

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
		const profiles = this.store.profiles.getProfileNamesByPage(page);

		this.$dialog.warning({
			title: this.$t('dialogs.deletePage.title').toString(),
			message: this.$t('dialogs.deletePage.message', { name: page.name, profiles: profiles.join(', ') }).toString(),
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
