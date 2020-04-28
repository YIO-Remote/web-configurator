import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { YioStore } from '..';
import { IIntegrationInstance, IKeyValuePair } from '../../types';

export class IntegrationsAggregate {
	public configured$: Observable<IIntegrationInstance[]>;
	public supported$: Observable<IKeyValuePair<object>>;
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
							...integrations[type].data.map((integrationInstance) => ({  ...integrationInstance, type }))
						];
					}, [] as IIntegrationInstance[]);
				})
			);

		this.supported$ = this.store.select('integrations', 'supported');
	}
}
