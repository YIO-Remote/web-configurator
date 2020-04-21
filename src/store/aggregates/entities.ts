import { YioStore } from '..';
import { map, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IEntity, IKeyValuePair } from '../../types';

export class EntitiesAggregate {
	public loaded$: Observable<IEntity[]>;
	public loadedGroupedByIntegration$: Observable<IKeyValuePair<IEntity[]>>;
	public available$: Observable<IEntity[]>;
	public availableGroupedByIntegration$: Observable<IKeyValuePair<IEntity[]>>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.loaded$ = this.store.select('entities', 'loaded')
			.pipe(
				map((entities) => Object.keys(entities).reduce((array: IEntity[], key: string) => [
					...array,
					...entities[key].map((entity) => ({ type: key, ...entity }))
					], [] as IEntity[]
				))
			);

		this.loadedGroupedByIntegration$ = this.loaded$
			.pipe(
				map((loaded) => {
					return loaded.reduce((groups, entity) => {
						groups[entity.type] = groups[entity.type] || [];
						groups[entity.type].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntity[]>);
				})
			);

		this.available$ = this.store.select('entities', 'available')
			.pipe(
				combineLatest(this.store.select('entities', 'loaded')),
				map(([available, configured]) => {
					const configuredIds = Object.keys(configured).reduce((array, key) => ([...array, ...configured[key].map((item) => item.entity_id)]), [] as string[]);
					return available.filter((availableEntity) => !configuredIds.includes(availableEntity.entity_id));
				})
			);

		this.availableGroupedByIntegration$ = this.store.select('entities', 'available')
			.pipe(
				combineLatest(this.store.select('entities', 'loaded')),
				map(([available, configured]) => {
					const configuredIds = Object.keys(configured).reduce((array, key) => ([...array, ...configured[key].map((item) => item.entity_id)]), [] as string[]);
					const filtered = available.filter((availableEntity) => !configuredIds.includes(availableEntity.entity_id));

					return filtered.reduce((groups, entity) => {
						groups[entity.integration] = groups[entity.integration] || [];
						groups[entity.integration].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntity[]>);
				})
			);
	}
}
