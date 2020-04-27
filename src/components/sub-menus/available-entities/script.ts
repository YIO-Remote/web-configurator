import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IEntityAggregate } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import ActionIconButton from '../../action-icon-button/index.vue';

@Component({
	name: 'AvailableEntities',
	components: {
		ActionIconButton
	},
	subscriptions(this: AvailableEntities) {
		return {
			available: this.store.entities.availableGroupedByIntegration$
		};
	}
})
export default class AvailableEntities extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public addEntity(entity: IEntityAggregate) {
		this.server.addEntity({
			area: entity.area,
			entity_id: entity.entity_id,
			friendly_name: entity.friendly_name,
			integration: entity.integration.id,
			supported_features: entity.supported_features,
			type: entity.type
		});
	}
}
