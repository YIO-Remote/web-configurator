import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IEntity, IKeyValuePair } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../utilities/server';
import ActionIconButton from '../../action-icon-button/index.vue';

@Component({
	name: 'AvailableEntities',
	components: {
		ActionIconButton
	},
	subscriptions(this: AvailableEntities) {
		return {
			available: this.store.entities.available
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
		console.log(entity);
		this.server.addEntity(entity);
	}
}
