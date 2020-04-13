import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { IConfigState } from '../../types';

export default function reducer(state: IConfigState = initialState, action: ConfigActionType): IConfigState {
	switch (action.type) {
		case getType(actions.updateConfig):
			return {
				...state,
				...action.payload
			};
		default:
			return state;
	}
}
