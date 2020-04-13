import { Observable } from 'rxjs';
import { map, share } from 'rxjs/operators';
import { YioStore } from '..';
import { IIntegrationInstance } from '../../types';

export class IntegrationsAggregate {
	public configured: Observable<IIntegrationInstance[]>;
	private store: YioStore;

	constructor(store: YioStore) {
		this.store = store;

		this.configured = this.store.select('config', 'integrations')
			.pipe(map((integrations) => {
				const types = Object.keys(integrations);

				return types.reduce((array: IIntegrationInstance[], type: string) => {
					return [
						...array,
						...integrations[type].data.map((integrationInstance) => ({  ...integrationInstance, type }))
					];
				}, [] as IIntegrationInstance[]);
			}))
			.pipe(share());
	}
}
