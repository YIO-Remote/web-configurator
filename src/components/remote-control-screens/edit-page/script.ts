import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IPageAggregate, IEntityAggregate, IGroupAggregate } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import ActionIconButton from '../../action-icon-button/index.vue';
import EditEntities from '../edit-entities/index.vue';
import { ServerConnection } from '../../../server';

@Component({
	name: 'EditPages',
	components: {
		ActionIconButton,
		EditEntities,
		Draggable
	},
	subscriptions(this: EditPage) {
		return {
			allGroups: this.store.groups.all$
		};
	}
})
export default class EditPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	@Prop({
		type: Object,
		required: true
	})
	public page: IPageAggregate;
	public allGroups: IGroupAggregate[];
	public dropZoneList = [];
	public isDraggedOver: boolean = false;
	public dropZoneOptions = {
		disabled: false,
		sort: false,
		group: 'groups'
	};

	public onDragOver() {
		this.isDraggedOver = true;
	}

	public onDragLeave() {
		this.isDraggedOver = false;
	}

	public onEntityAdded(group: IGroupAggregate, entity: IEntityAggregate) {
		console.log(group.name, entity.friendly_name);
		this.server.addEntityToGroup(group, entity);
	}

	public onEntityRemoved(group: IGroupAggregate, entity: IEntityAggregate) {
		console.log(group.name, entity.friendly_name);
		this.server.removeEntityFromGroup(group, entity);
	}

	public onGroupDropped(event: IDragEndEvent) {
		this.dropZoneList = [];
		const groupId = event.item.getAttribute('data-id');
		const matchingGroup = this.allGroups.find((group) => group.id === groupId);

		if (matchingGroup) {
			this.server.addGroupToPage(this.page, matchingGroup);
		}

		this.isDraggedOver = false;
	}

	public onGroupRemoved(group: IGroupAggregate) {
		this.server.removeGroupFromPage(this.page, group);
	}

	public onEntitySortOrderChanged(group: IGroupAggregate, event: IDragEndEvent) {
		this.server.updateEntitySortOrder(group, event.oldDraggableIndex, event.newDraggableIndex);
	}
}
