import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { IEntityAggregate, IKeyValuePair } from '../../../types';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import ActionIconButton from '../../action-icon-button/index.vue';
import TextInput from '../../text-input/index.vue';
import Icon from '../../icon/index.vue';

@Component({
	name: 'AvailableEntities',
	components: {
		ActionIconButton,
		TextInput,
		Icon
	}
})
export default class AvailableEntities extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;
	public filteredGroupedEntities: IKeyValuePair<IEntityAggregate[]> = {};
	public entitySearchName: string = '';

	public mounted() {
		this.$subscribeTo(
			this.store.entities.generateFilterStream$(
				this.$watchAsObservable('entitySearchName').pipe(map((watcher) => watcher.newValue as string)),
				this.store.entities.available$,
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
