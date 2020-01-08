import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { DIContainer } from '../../utilities/dependency-injection';
import { ServerConnection } from '../../utilities/server';
import { IConfigState } from '../../types';

export default function reducer(state: IConfigState = initialState, action: ConfigActionType): IConfigState {
	let newState;

	switch (action.type) {
		case getType(actions.updateDarkMode):
			newState = {
				...state,
				ui_config: {
					...state.ui_config,
					darkmode: action.payload
				}
			};
			break;
		case getType(actions.updateAutoBrightness):
			newState = {
				...state,
				settings: {
					...state.settings,
					autobrightness: action.payload
				}
			};
			break;
		case getType(actions.updateAutoSoftwareUpdate):
			newState = {
				...state,
				settings: {
					...state.settings,
					softwareupdate: action.payload
				}
			};
			break;
		case getType(actions.updateConfig):
			newState = {
				...state,
				...action.payload
			};

			if (!action.meta) {
				DIContainer.resolve(ServerConnection).setConfig(newState);
			}
			break;
		default:
			newState = state;
			break;
	}

	if (!action.meta) {
		DIContainer.resolve(ServerConnection).setConfig(newState);
	}

	return newState;
}
