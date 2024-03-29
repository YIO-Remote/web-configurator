import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { YioStore } from '..';
import { IIntegrationInstance, IKeyValuePair, IDiscoveredIntegration } from '../../types';

export class IntegrationsAggregate {
	public configured$: Observable<IIntegrationInstance[]>;
	public supported$: Observable<IKeyValuePair<object>>;
	public discovered$: Observable<IDiscoveredIntegration[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.configured$ = this.store.select('integrations', 'configured')
			.pipe(
				map((integrations) => {
					const types = Object.keys(integrations);

					return types.reduce((array: IIntegrationInstance[], type: string) => {
						return [
							...array,
							...integrations[type].data.map((integrationInstance) => ({
								...integrationInstance,
								type,
								friendly_name_search_term: integrationInstance.friendly_name
							}))
						];
					}, [] as IIntegrationInstance[]);
				})
			);

		this.supported$ = this.store.select('integrations', 'supported');
		this.discovered$ = this.store.select('integrations', 'discovered');
	}
}
