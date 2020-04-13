import { createStandardAction, ActionType } from 'typesafe-actions';
import { IKeyValuePair } from '../../types';

const actions = {
	updateSupportedIntegrations: createStandardAction('store/supported-integrations/update')<IKeyValuePair<object>>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
