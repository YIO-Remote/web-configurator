import { YioStore } from '..';
import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { IGroupAggregate, IEntityAggregate } from '../../types';

export class GroupsAggregate {
	public all$: Observable<IGroupAggregate[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.all$ = combineLatest(this.store.select('groups', 'all'), this.store.entities.loaded$)
			.pipe(
				map(([groups, entities]) => Object.keys(groups).reduce((array: IGroupAggregate[], groupId: string) => [
					...array,
					{
						id: groupId,
						name: groups[groupId].name,
						switch: groups[groupId].switch,
						entities: groups[groupId].entities.map((entityId) => entities.find((entity) => entity.entity_id === entityId) as IEntityAggregate)
					}
					], [] as IGroupAggregate[]
				))
			);
	}
}
