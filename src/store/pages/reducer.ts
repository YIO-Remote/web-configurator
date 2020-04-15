import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { IPagesState } from '../../types';

export default function reducer(state: IPagesState = initialState, action: YioStoreActionTypes): IPagesState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				all: action.payload.ui_config.pages
			};
		case getType(actions.setPages):
			return {
				...state,
				all: action.payload
			};
		default:
			return state;
	}
}
