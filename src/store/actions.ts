import { createStandardAction, ActionType } from 'typesafe-actions';
import { IKeyValuePair, IEntity, IConfigState, IIntegration } from '../types';

const actions = {
	// Config
	updateConfig: createStandardAction('store/config/update')<IConfigState>(),

	// Entities
	setSupportedEntityTypes: createStandardAction('store/entities/set-supported')<string[]>(),
	setLoadedEntities: createStandardAction('store/entities/set-loaded')<IKeyValuePair<IEntity[]>>(),
	setAvailableEntities: createStandardAction('store/entities/set-available')<IKeyValuePair<IEntity[]>>(),

	// Integrations
	setConfiguredIntegrations: createStandardAction('store/integrations/set-configured')<IKeyValuePair<IIntegration>>(),
	setSupportedIntegrations: createStandardAction('store/integrations/set-supported')<IKeyValuePair<object>>()
};

export default actions;
export type YioStoreActionTypes = ActionType<typeof actions>;
