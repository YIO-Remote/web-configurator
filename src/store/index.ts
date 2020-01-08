import { IState } from '../types';
import { Singleton } from '../utilities/dependency-injection';
import { Store } from '../utilities/store';
import actions, { YioStoreActions } from './actions';
import initialState from './initial-state';
import reducers from './reducers';

@Singleton
export class YioStore extends Store<IState, YioStoreActions> {
	constructor() {
		super(reducers, actions, initialState);
	}
}
