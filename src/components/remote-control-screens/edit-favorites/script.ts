import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IEntityAggregate, IProfileAggregate } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import EditEntities from '../edit-entities/index.vue';

@Component({
	name: 'EditFavorites',
	components: {
		EditEntities,
		Draggable
	}
})
export default class EditFavorites extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	@Prop({
		type: Object,
		required: true
	})
	public profile: IProfileAggregate;

	public onEntityAdded(entity: IEntityAggregate) {
		this.server.addFavorite(this.profile, entity);
	}

	public onEntityRemoved(entity: IEntityAggregate) {
		this.server.removeFavorite(this.profile, entity);
	}

	public onEntitySortOrderChanged(event: IDragEndEvent) {
		this.server.updateFavoritesSortOrder(this.profile, event.oldDraggableIndex, event.newDraggableIndex);
	}
}
