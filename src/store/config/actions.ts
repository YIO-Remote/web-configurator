import { createStandardAction, ActionType } from 'typesafe-actions';
import { IConfigState } from '../../types';

const actions = {
	updateConfig: createStandardAction('store/config/update')<IConfigState>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
