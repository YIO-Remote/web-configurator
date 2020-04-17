import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { YioStore } from '..';
import { IPage } from '../../types';

export class PagesAggregate {
	public all: Observable<IPage[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.all = this.store.select('pages', 'all')
			.pipe(
				map((pages) => Object.keys(pages).reduce((array: IPage[], id: string) => [
					...array,
					{ ...pages[id], id }
					], [] as IPage[]
				))
			);
	}
}
