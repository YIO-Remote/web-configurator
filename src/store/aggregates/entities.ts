import { YioStore } from '..';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { IEntityAggregate, IKeyValuePair, IIntegrationInstance } from '../../types';

export class EntitiesAggregate {
	public loaded$: Observable<IEntityAggregate[]>;
	public loadedGroupedByIntegration$: Observable<IKeyValuePair<IEntityAggregate[]>>;
	public available$: Observable<IEntityAggregate[]>;
	public availableGroupedByIntegration$: Observable<IKeyValuePair<IEntityAggregate[]>>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.loaded$ = combineLatest(this.store.select('entities', 'loaded'), this.store.integrations.configured$)
			.pipe(
				map(([entities, integrations]) => Object.keys(entities).reduce((array: IEntityAggregate[], entityType: string) => [
					...array,
					...entities[entityType].map<IEntityAggregate>((entity) => ({
						type: entityType,
						area: entity.area,
						entity_id: entity.entity_id,
						friendly_name: entity.friendly_name,
						supported_features: entity.supported_features,
						integration: integrations.find((integration) => integration.id === entity.integration) as IIntegrationInstance
					}))
					], [] as IEntityAggregate[]
				)),
				shareReplay()
			);

		this.loadedGroupedByIntegration$ = this.loaded$
			.pipe(
				map((loaded) => {
					return loaded.reduce((groups, entity) => {
						groups[entity.type] = groups[entity.type] || [];
						groups[entity.type].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntityAggregate[]>);
				}),
				shareReplay()
			);

		this.available$ = combineLatest(
				this.store.select('entities', 'available'),
				this.loaded$,
				this.store.integrations.configured$
			).pipe(
				map(([available, configured, integrations]) => {
					const configuredIds = configured.map((entity) => entity.entity_id);
					const availableEntities = available.map<IEntityAggregate>((entity) => ({
						area: entity.area,
						entity_id: entity.entity_id,
						friendly_name: entity.friendly_name,
						supported_features: entity.supported_features,
						type: entity.type,
						integration: integrations.find((integration) => integration.id === entity.integration) as IIntegrationInstance
					}));

					return availableEntities.filter((availableEntity) => !configuredIds.includes(availableEntity.entity_id));
				}),
				shareReplay()
			);

		this.availableGroupedByIntegration$ = this.available$
			.pipe(
				map((available) => {
					return available.reduce((groups, entity) => {
						groups[entity.integration.friendly_name] = groups[entity.integration.friendly_name] || [];
						groups[entity.integration.friendly_name].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntityAggregate[]>);
				}),
				shareReplay()
			);
	}
}
