import { createStandardAction, ActionType } from 'typesafe-actions';
import { IConfig, UpdateFromServer } from '../../types';

const actions = {
    updateConfig: createStandardAction('store/config/update')<IConfig, UpdateFromServer>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;