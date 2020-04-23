import { Observable, combineLatest } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { YioStore } from '..';
import { IProfile, IKeyValuePair, IProfileAggregate, IPageAggregate, IEntityAggregate } from '../../types';

export class ProfilesAggregate {
	public profiles$: Observable<IProfileAggregate[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		const mapProfiles = (profiles: IKeyValuePair<IProfile>, entities: IEntityAggregate[], pages: IPageAggregate[]) => {
			return Object.keys(profiles).reduce((array, profileId) => {
				const sortedPages = [
					pages.find((page) => page.id === 'favorites') as IPageAggregate,
					...pages.filter((page) => page.id !== 'favorites' && page.id !== 'settings'),
					pages.find((page) => page.id === 'settings') as IPageAggregate,
				];

				return [
					...array,
					{
						id: profileId,
						name: profiles[profileId].name,
						initial: profiles[profileId].name.substr(0, 1).toUpperCase(),
						favorites: entities.filter((entity) => profiles[profileId].favorites.includes(entity.entity_id)),
						pages: sortedPages.filter((page) => profiles[profileId].pages.includes(page.id))
					}
				];
			}, [] as IProfileAggregate[]);
		};

		this.profiles$ = combineLatest(
				this.store.select('profiles', 'all'),
				this.store.pages.all$,
				this.store.entities.loaded$
			).pipe(
				map<[IKeyValuePair<IProfile>, IPageAggregate[], IEntityAggregate[]], IProfileAggregate[]>(([profile, pages, entities]) => {
					return mapProfiles(profile, entities, pages);
				}),
				shareReplay()
			);
	}

	public profile$(id: string) {
		return this.profiles$.pipe(map((profiles) => profiles.find((profile) => profile.id === id)));
	}
}
