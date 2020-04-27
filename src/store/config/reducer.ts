import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IConfigState } from '../../types';

export default function reducer(state: IConfigState = initialState, action: YioStoreActionTypes): IConfigState {
	switch (action.type) {
		case getType(actions.setLanguage):
			return {
				...state,
				settings: {
					...state.settings,
					language: action.payload
				}
			};
		case getType(actions.updateConfig):
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
}
