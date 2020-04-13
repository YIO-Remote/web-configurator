import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { DIContainer } from '../../utilities/dependency-injection';
import { ServerConnection } from '../../utilities/server';
import { IConfigState } from '../../types';

export default function reducer(state: IConfigState = initialState, action: ConfigActionType): IConfigState {
	let newState: IConfigState = state;

	switch (action.type) {
		case getType(actions.updateConfig):
			newState = {
				...state,
				...action.payload
			};
			break;
		default:
			newState = state;
			break;
	}

	const initialHash = JSON.stringify(initialState);
	const origHash = JSON.stringify(state);
	const newHash = JSON.stringify(newState);

	if (origHash !== newHash && origHash !== initialHash) {
		DIContainer.resolve(ServerConnection).setConfig(newState);
	}

	return newState;
}
