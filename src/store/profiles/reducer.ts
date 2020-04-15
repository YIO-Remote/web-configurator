import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IProfilesState } from '../../types';

export default function reducer(state: IProfilesState = initialState, action: YioStoreActionTypes): IProfilesState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				all: action.payload.ui_config.profiles
			};
		case getType(actions.setProfiles):
			return {
				...state,
				all: action.payload
			};
		default:
			return state;
	}
}
