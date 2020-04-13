import { IState } from '../types';
import { Singleton } from '../utilities/dependency-injection';
import { Store } from '../utilities/store';
import { EntitiesAggregate } from './aggregates/entities';
import { IntegrationsAggregate } from './aggregates/integrations';
import actions, { YioStoreActions } from './actions';
import initialState from './initial-state';
import reducers from './reducers';

@Singleton
export class YioStore extends Store<IState, YioStoreActions> {
	public entities: EntitiesAggregate;
	public integrations: IntegrationsAggregate;

	constructor() {
		super(reducers, actions, initialState);
		this.entities = new EntitiesAggregate(this);
		this.integrations = new IntegrationsAggregate(this);
	}
}
