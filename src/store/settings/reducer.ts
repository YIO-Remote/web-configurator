import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { YioStoreActionTypes } from '../actions';
import { ISettingsState } from '../../types';

export default function reducer(state: ISettingsState = initialState, action: YioStoreActionTypes): ISettingsState {
	switch (action.type) {
		case getType(actions.setLanguages):
			return {
				...state,
				languages: action.payload.sort((a, b) => {
					const languageA = a.name.toUpperCase();
					const languageB = b.name.toUpperCase();

					if (languageA < languageB) {
						return -1;
					}
					if (languageA > languageB) {
						return 1;
					}

					return 0;
				})
			};
		default:
			return state;
	}
}
