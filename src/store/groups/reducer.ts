import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IGroupsState } from '../../types';

export default function reducer(state: IGroupsState = initialState, action: YioStoreActionTypes): IGroupsState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				all: action.payload.ui_config.groups
			};
		case getType(actions.setGroups):
			return {
				...state,
				all: action.payload
			};
		default:
			return state;
	}
}
