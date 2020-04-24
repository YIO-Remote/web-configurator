import { map, shareReplay } from 'rxjs/operators';
import { Observable, combineLatest } from 'rxjs';
import { YioStore } from '..';
import { IPageAggregate, IGroupAggregate } from '../../types';

export class PagesAggregate {
	public favoritePage: IPageAggregate;
	public settingsPage: IPageAggregate;
	public all$: Observable<IPageAggregate[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.favoritePage = {
			id: 'favorites',
			name: 'Favorites',
			image: '',
			groups: []
		};

		this.settingsPage = {
			id: 'settings',
			name: 'Settings',
			image: '',
			groups: []
		};

		this.all$ = combineLatest(this.store.select('pages', 'all'), this.store.groups.all$)
			.pipe(
				map(([pages, groups]) => Object.keys(pages).reduce((array: IPageAggregate[], pageId: string) => [
						...array,
						{
							id: pageId,
							name: pages[pageId].name,
							image: pages[pageId].image,
							groups: pages[pageId].groups.map((groupId) => groups.find((group) => group.id === groupId) as IGroupAggregate)
						}], [this.favoritePage, this.settingsPage] as IPageAggregate[]
				)),
				shareReplay()
			);
	}
}
