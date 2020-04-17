import { YioStore } from '..';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { IGroup } from '../../types';

export class GroupsAggregate {
	public all: Observable<IGroup[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.all = this.store.select('groups', 'all')
			.pipe(
				map((groups) => Object.keys(groups).reduce((array: IGroup[], id: string) => [
					...array,
					{ ...groups[id], id }
					], [] as IGroup[]
				))
			);
	}
}
