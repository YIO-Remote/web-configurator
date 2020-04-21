import { YioStore } from '..';
import { map, shareReplay } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { IGroupAggregate } from '../../types';

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
						entities: entities.filter((entity) => groups[groupId].entities.includes(entity.entity_id))
					}
					], [] as IGroupAggregate[]
				)),
				shareReplay()
			);
	}
}
