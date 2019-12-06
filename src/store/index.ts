import { Store } from '../utilities/store';
import { Singleton } from '../utilities/dependency-injection';
import { IState } from '../types';
import reducers from './reducers';
import actions, { YioStoreActions } from './actions';
import initialState from './initial-state';

@Singleton
export class YioStore extends Store<IState, YioStoreActions> {
    constructor() {
        super(reducers, actions, initialState);
    }
}