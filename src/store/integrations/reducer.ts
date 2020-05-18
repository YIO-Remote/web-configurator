import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IIntegrationsState } from '../../types';

export default function reducer(state: IIntegrationsState = initialState, action: YioStoreActionTypes): IIntegrationsState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				...{
					configured: action.payload.integrations
				}
			};
		case getType(actions.addDiscoveredIntegration):
			const alreadyAdded = !!state.discovered.find((existing) => JSON.stringify(existing) === JSON.stringify(action.payload));

			return {
				...state,
				discovered: [...state.discovered, ...(alreadyAdded ? [] : [action.payload])]
			};
		case getType(actions.setSearchingForIntegrations):
			return {
				...state,
				isSearchingForIntegrations: action.payload
			};
		case getType(actions.setSupportedIntegrations):
			return {
				...state,
				supported: action.payload
			};
		case getType(actions.setConfiguredIntegrations):
			return {
				...state,
				configured: action.payload
			};
		default:
			return state;
	}
}
