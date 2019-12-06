import { getType } from 'typesafe-actions';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { DIContainer } from '../../utilities/dependency-injection';
import { ServerConnection } from '../../utilities/server';
import { IConfigState } from '../../types';

export default function reducer(state: IConfigState = initialState, action: ConfigActionType): IConfigState {
    switch (action.type) {
        case getType(actions.updateConfig):
            const newState = {
                ...state,
                ...action.payload
            };

            if (!action.meta) {
                DIContainer.resolve(ServerConnection).setConfig(newState);
            }

            return newState;
        default:
            return state;
    }
}