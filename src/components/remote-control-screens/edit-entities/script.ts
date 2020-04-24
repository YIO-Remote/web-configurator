import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IEntityAggregate } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';

@Component({
	name: 'EditEntities',
	components: {
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
		disabled: true,
		sort: false,
		animation: 200,
		group: 'entities'
	};
	public dropZoneOptions = {
		disabled: false,
		sort: false,
		group: 'entities'
	};

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
}
