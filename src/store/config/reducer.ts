import { getType } from 'typesafe-actions';
import { IConfig } from '../../types';
import initialState from './initial-state';
import actions, { ConfigActionType } from './actions';
import { DIContainer } from '../../utilities/dependency-injection';
import { ServerConnection } from '../../utilities/server';

export default function reducer(state: IConfig = initialState, action: ConfigActionType): IConfig {
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