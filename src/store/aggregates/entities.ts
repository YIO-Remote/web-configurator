import Fuse from 'fuse.js';
import { Observable, combineLatest } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { YioStore } from '..';
import { IEntityAggregate, IKeyValuePair, IIntegrationInstance } from '../../types';

export class EntitiesAggregate {
	public loaded$: Observable<IEntityAggregate[]>;
	public loadedGroupedByIntegration$: Observable<IKeyValuePair<IEntityAggregate[]>>;
	public available$: Observable<IEntityAggregate[]>;
	public availableGroupedByIntegration$: Observable<IKeyValuePair<IEntityAggregate[]>>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.loaded$ = combineLatest(this.store.select('entities', 'loaded'), this.store.integrations.configured$)
			.pipe(
				map(([entities, integrations]) => Object.keys(entities).reduce((array: IEntityAggregate[], entityType: string) => [
					...array,
					...entities[entityType].map<IEntityAggregate>((entity) => ({
						type: entityType,
						area: entity.area,
						entity_id: entity.entity_id,
						friendly_name: entity.friendly_name,
						friendly_name_search_term: entity.friendly_name,
						supported_features: entity.supported_features,
						integration: integrations.find((integration) => integration.id === entity.integration) as IIntegrationInstance
					}))
					], [] as IEntityAggregate[]
				))
			);

		this.loadedGroupedByIntegration$ = this.loaded$
			.pipe(
				map((loaded) => {
					return loaded.filter((entity) => !!entity.integration).reduce((groups, entity) => {
						groups[entity.integration.friendly_name] = groups[entity.integration.friendly_name] || [];
						groups[entity.integration.friendly_name].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntityAggregate[]>);
				})
			);

		this.available$ = combineLatest(
				this.store.select('entities', 'available'),
				this.loaded$,
				this.store.integrations.configured$
			).pipe(
				map(([available, configured, integrations]) => {
					const configuredIds = configured.map((entity) => entity.entity_id);
					const availableEntities = available.map<IEntityAggregate>((entity) => ({
						area: entity.area,
						entity_id: entity.entity_id,
						friendly_name: entity.friendly_name,
						friendly_name_search_term: entity.friendly_name,
						supported_features: entity.supported_features,
						type: entity.type,
						integration: integrations.find((integration) => integration.id === entity.integration) as IIntegrationInstance
					}));

					return availableEntities.filter((availableEntity) => !configuredIds.includes(availableEntity.entity_id));
				})
			);

		this.availableGroupedByIntegration$ = this.available$
			.pipe(
				map((available) => {
					return available.filter((entity) => !!entity.integration).reduce((groups, entity) => {
						groups[entity.integration.friendly_name] = groups[entity.integration.friendly_name] || [];
						groups[entity.integration.friendly_name].push(entity);
						return groups;
					}, {} as IKeyValuePair<IEntityAggregate[]>);
				})
			);
	}

	public generateFilterStream$(criteriaStream$: Observable<string>, itemsStream$: Observable<IEntityAggregate[]>, keys: string[]): Observable<IEntityAggregate[]> {
		return combineLatest(
			itemsStream$,
			criteriaStream$.pipe(startWith(''))
		).pipe(
			map(([items, searchTerm]) => {
				if (!searchTerm) {
					return items;
				}

				const fuse = new Fuse(items, {
					keys,
					threshold: 0.4,
					includeMatches: true
				});

				return fuse.search<IEntityAggregate>(searchTerm).map((result) => {
					if (!result.matches) {
						return result.item;
					}

					return result.matches.reduce((item, match) => {
						if (match.key === 'friendly_name') {
							return {
								...item,
								friendly_name_search_term: generateHighlightedText(match.value as string, match.indices)
							};
						}

						if (match.key === 'integration.friendly_name') {
							return {
								...item,
								integration: {
									...item.integration,
									friendly_name_search_term: generateHighlightedText(match.value as string, match.indices)
								}
							};
						}

						return item;
					}, result.item);
				});
			})
		);
	}
}

function generateHighlightedText(text: string, regions: ReadonlyArray<Fuse.RangeTuple>) {
	if (!regions) { return text; }

	let content = '';
	let nextUnhighlightedRegionStartingIndex = 0;

	regions.forEach((region) => {
	  content += '' +
		text.substring(nextUnhighlightedRegionStartingIndex, region[0]) +
		'<span class="highlight">' +
		  text.substring(region[0], region[1]) +
		'</span>' +
	  '';
	  nextUnhighlightedRegionStartingIndex = region[1];
	});

	content += text.substring(nextUnhighlightedRegionStartingIndex);

	return content;
  }
