import { map } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { YioStore } from '..';
import { IPageAggregate } from '../../types';

export class PagesAggregate {
	public all$: Observable<IPageAggregate[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.all$ = combineLatest(this.store.select('pages', 'all'), this.store.groups.all$)
			.pipe(
				map(([pages, groups]) => Object.keys(pages).reduce((array: IPageAggregate[], pageId: string) => [
					...array,
					{
						id: pageId,
						name: pages[pageId].name,
						image: pages[pageId].image,
						groups: groups.filter((group) => pages[pageId].groups.includes(group.id))
					},
					], [] as IPageAggregate[]
				))
			);
	}
}
