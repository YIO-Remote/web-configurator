import { createStandardAction, ActionType } from 'typesafe-actions';
import { IKeyValuePair, IEntity, IConfigState, IIntegration, IProfile, IPage, IGroup } from '../types';

const actions = {
	// Config
	updateConfig: createStandardAction('store/config/update')<IConfigState>(),

	// Entities
	setSupportedEntityTypes: createStandardAction('store/entities/set-supported')<string[]>(),
	setLoadedEntities: createStandardAction('store/entities/set-loaded')<IKeyValuePair<IEntity[]>>(),
	setAvailableEntities: createStandardAction('store/entities/set-available')<IEntity[]>(),

	// Integrations
	setConfiguredIntegrations: createStandardAction('store/integrations/set-configured')<IKeyValuePair<IIntegration>>(),
	setSupportedIntegrations: createStandardAction('store/integrations/set-supported')<IKeyValuePair<object>>(),

	// Profiles
	setProfiles: createStandardAction('store/profiles/set-all')<IKeyValuePair<IProfile>>(),

	// Pages
	setPages: createStandardAction('store/pages/set-all')<IKeyValuePair<IPage>>(),

	// Groups
	setGroups: createStandardAction('store/groups/set-all')<IKeyValuePair<IGroup>>(),
};

export default actions;
export type YioStoreActionTypes = ActionType<typeof actions>;
