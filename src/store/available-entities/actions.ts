import { createStandardAction, ActionType } from 'typesafe-actions';
import { IKeyValuePair, IEntity } from '../../types';

const actions = {
	updateAvailableEntities: createStandardAction('store/available-entities/update')<IKeyValuePair<IEntity[]>>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
