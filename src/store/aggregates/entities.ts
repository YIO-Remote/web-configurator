import { YioStore } from '..';
import { map, combineLatest } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IEntity, IKeyValuePair } from '../../types';

export class EntitiesAggregate {
	public configured: Observable<IEntity[]>;
	public available: Observable<IKeyValuePair<IEntity[]>>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.configured = this.store.select('config', 'entities')
			.pipe(
				map((entities) => Object.keys(entities).reduce((array: IEntity[], key: string) => [
					...array,
					...entities[key].map((entity) => ({ type: key, ...entity }))
					], [] as IEntity[]
				))
			);

		this.available = this.store.select('availableEntities', 'entities')
			.pipe(
				map((entities) => Object.keys(entities).reduce((array: IEntity[], key: string) => [
					...array,
					...entities[key].map((entity) => ({ type: key, ...entity }))
					], [] as IEntity[]
				))
			)
			.pipe(combineLatest(this.store.select('config', 'entities')))
			.pipe(
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
