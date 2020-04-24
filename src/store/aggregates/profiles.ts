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
				return [
					...array,
					{
						id: profileId,
						name: profiles[profileId].name,
						initial: profiles[profileId].name.substr(0, 1).toUpperCase(),
						favorites: entities.filter((entity) => profiles[profileId].favorites.includes(entity.entity_id)),
						pages: profiles[profileId].pages.map((pageId) => pages.find((page) => page.id === pageId) as IPageAggregate)
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
