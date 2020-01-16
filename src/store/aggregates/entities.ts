import { YioStore } from '..';
import { map, share } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IEntity, IKeyValuePair } from '../../types';

export class EntitiesAggregate {
	public configured: Observable<IEntity[]>;
	public availableByIntegrations: Observable<IKeyValuePair<IEntity[]>>;
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
			)
			.pipe(share());

		this.availableByIntegrations = this.store.select('config', 'entities')
			.pipe(
				map((entities) => Object.keys(entities).reduce((array: IEntity[], key: string) => [
					...array,
					...entities[key].map((entity) => ({ type: key, ...entity }))
					], [] as IEntity[]
				))
			)
			.pipe(
				map((entities) => entities.reduce((groups, entity) => {
					groups[entity.integration] = groups[entity.integration] || [];
					groups[entity.integration].push(entity);
					return groups;
				}, {} as IKeyValuePair<IEntity[]>))
			)
			.pipe(share());
	}
}
