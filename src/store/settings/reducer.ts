import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { ISettingsState } from '../../types';

export default function reducer(state: ISettingsState = initialState, action: YioStoreActionTypes): ISettingsState {
	switch (action.type) {
		case getType(actions.setLanguages):
			return {
				...state,
				languages: action.payload
			};
		default:
			return state;
	}
}
