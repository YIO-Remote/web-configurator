import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { ISupportedIntegrationsState } from '../../types';

export default function reducer(state: ISupportedIntegrationsState = initialState, action: ConfigActionType): ISupportedIntegrationsState {
	switch (action.type) {
		case getType(actions.updateSupportedIntegrations):
			return {
				...state,
				integrations: action.payload
			};
		default:
			return state;
	}
}
