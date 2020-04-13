import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { IAvailableEntitiesState } from '../../types';

export default function reducer(state: IAvailableEntitiesState = initialState, action: ConfigActionType): IAvailableEntitiesState {
	switch (action.type) {
		case getType(actions.updateAvailableEntities):
			return {
				...state,
				entities: action.payload
			};
		default:
			return state;
	}
}
