import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IEntity, IKeyValuePair } from '../../../types';
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
			available: this.store.entities.availableGroupedByIntegration
		};
	}
})
export default class AvailableEntities extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public available: IKeyValuePair<IEntity[]>;

	public addEntity(entity: IEntity) {
		this.server.addEntity(entity);
	}
}
