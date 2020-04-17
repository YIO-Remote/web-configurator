import { Observable } from 'rxjs';
import { map, combineLatest } from 'rxjs/operators';
import { YioStore } from '..';
import { IProfile, IKeyValuePair, IPage, IEntity, IProfileAggregate, IGroup, IPageAggregate, IGroupAggregate } from '../../types';

export class ProfilesAggregate {
	public profiles$: Observable<IProfileAggregate[]>;
	private pages$: Observable<IKeyValuePair<IPage>>;
	private groups$: Observable<IKeyValuePair<IGroup>>;
	private entities$: Observable<IEntity[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;
		this.pages$ = this.store.select('pages', 'all');
		this.groups$ = this.store.select('groups', 'all');

		this.entities$ = this.store.select('entities', 'loaded').pipe(
			map((entities) => Object.keys(entities).reduce((array, key) => {
				return [
					...array,
					...entities[key].map((entity) => ({ ...entity, type: key }))
				];
			}, [] as IEntity[]))
		);

		const mapProfiles = (profiles: IKeyValuePair<IProfile>, entities: IEntity[], pages: IKeyValuePair<IPage>, groups: IKeyValuePair<IGroup>) => {
			return Object.keys(profiles).reduce((array, key) => {
				return [
					...array,
					createProfile(key, profiles[key], entities, pages, groups)
				];
			}, [] as IProfileAggregate[]);
		};

		const createProfile = (id: string, profile: IProfile, entities: IEntity[], pages: IKeyValuePair<IPage>, groups: IKeyValuePair<IGroup>): IProfileAggregate => {
			return {
				id,
				name: profile.name,
				favorites: entities.filter((entity) => profile.favorites.includes(entity.entity_id)),
				pages: createPages(profile.pages, pages, groups, entities)
			};
		};

		const createPages = (pageIds: string[], pages: IKeyValuePair<IPage>, groups: IKeyValuePair<IGroup>, entities: IEntity[]): IPageAggregate[] => {
			console.log(pageIds, pages);

			return pageIds.filter((pageId) => !isNaN(+pageId)).map<IPageAggregate>((pageId) => {
				const page = pages[pageId];

				return {
					image: page.image,
					name: page.name,
					groups: page.groups.map<IGroupAggregate>((groupId) => {
						const group = groups[groupId];

						return {
							id: groupId,
							name: group.name,
							entities: entities.filter((entity) => group.entities.includes(entity.entity_id)),
							switch: group.switch
						};
					})
				};
			});
		};

		this.profiles$ = this.store.select('profiles', 'all').pipe(
			combineLatest(this.pages$, this.entities$, this.groups$),
			map<[IKeyValuePair<IProfile>, IKeyValuePair<IPage>, IEntity[], IKeyValuePair<IGroup>], IProfileAggregate[]>(([profile, pages, entities, groups]) => {
				return mapProfiles(profile, entities, pages, groups);
			})
		);

	}

	public profile$(id: string) {
		return this.profiles$.pipe(map((profiles) => profiles.find((profile) => profile.id === id)));
	}
}
