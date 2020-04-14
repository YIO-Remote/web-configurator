import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IEntitiesState } from '../../types';

export default function reducer(state: IEntitiesState = initialState, action: YioStoreActionTypes): IEntitiesState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				loaded: action.payload.entities
			};
		case getType(actions.setAvailableEntities):
			return {
				...state,
				available: action.payload
			};
		case getType(actions.setLoadedEntities):
			return {
				...state,
				loaded: action.payload
			};
		case getType(actions.setSupportedEntityTypes):
			return {
				...state,
				supported: action.payload
			};
		default:
			return state;
	}
}
