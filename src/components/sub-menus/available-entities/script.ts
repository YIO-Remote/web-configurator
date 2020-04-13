import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IEntity, IKeyValuePair } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../utilities/server';

@Component({
	name: 'AvailableEntities',
	components: {
		ActionIconButton
	},
	subscriptions(this: AvailableEntities) {
		return {
			entities: this.store.entities.availableByIntegrations
		};
	}
})
export default class AvailableEntities extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	// @Prop({
	// 	type: Object,
	// 	required: true
	// })
	public entities: IKeyValuePair<IEntity[]>;

	public addEntity(entity: IEntity) {
		alert(`Add entity ---> ${entity.friendly_name}`);
	}

	public getFriendlyName(key: string) {
		return this.entities[key];
	}

	public mounted() {
		this.server.getEntities();
	}
}
