import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IEntityAggregate } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import ActionIconButton from '../../action-icon-button/index.vue';
import Icon from '../../icon/index.vue';

@Component({
	name: 'EditEntities',
	components: {
		Icon,
		ActionIconButton,
		Draggable
	},
	subscriptions(this: EditEntities) {
		return {
			allEntities: this.store.entities.loaded$
		};
	}
})
export default class EditEntities extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Prop({
		type: Array,
		required: true
	})
	public entities: IEntityAggregate[];
	public allEntities: IEntityAggregate[];
	public dropZoneList = [];
	public isDraggedOver: boolean = false;
	public dragOptions = {
		disabled: false,
		sort: true,
		animation: 200,
		group: {
			name: 'entities',
			pull: false,
			put: false
		}
	};
	public dropZoneOptions = {
		disabled: false,
		sort: false,
		group: 'entities'
	};

	public entitiesListData = this.entities.slice(0);

	public onDragOver() {
		this.isDraggedOver = true;
	}

	public onDragLeave() {
		this.isDraggedOver = false;
	}

	public onEntityDropped(event: IDragEndEvent) {
		this.dropZoneList = [];
		const entityId = event.item.getAttribute('data-id');
		const matchingEntity = this.allEntities.find((entity) => entity.entity_id === entityId);

		if (matchingEntity) {
			this.$emit('onEntityAdded', matchingEntity);
		}

		this.isDraggedOver = false;
	}

	public onEntityRemoved(entity: IEntityAggregate) {
		this.$emit('onEntityRemoved', entity);
	}

	public onEntitySortOrderChanged(event: IDragEndEvent) {
		this.$emit('onEntitySortOrderChanged', event);
	}
}
