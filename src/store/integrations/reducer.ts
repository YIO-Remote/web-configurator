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
