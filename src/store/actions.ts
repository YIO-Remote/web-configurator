import { createStandardAction, ActionType } from 'typesafe-actions';
import { IKeyValuePair, IEntity, IConfigState, IIntegration, IIntegrationSchema, IProfile, IPage, IGroup, ILanguageSetting } from '../types';

const actions = {
	// Config
	updateConfig: createStandardAction('store/config/update')<IConfigState>(),

	// Entities
	setSupportedEntityTypes: createStandardAction('store/entities/set-supported')<string[]>(),
	setLoadedEntities: createStandardAction('store/entities/set-loaded')<IKeyValuePair<IEntity[]>>(),
	setAvailableEntities: createStandardAction('store/entities/set-available')<IEntity[]>(),

	// Integrations
	setConfiguredIntegrations: createStandardAction('store/integrations/set-configured')<IKeyValuePair<IIntegration>>(),
	setSupportedIntegrations: createStandardAction('store/integrations/set-supported')<IKeyValuePair<IIntegrationSchema>>(),

	// Profiles
	setProfiles: createStandardAction('store/profiles/set-all')<IKeyValuePair<IProfile>>(),

	// Pages
	setPages: createStandardAction('store/pages/set-all')<IKeyValuePair<IPage>>(),

	// Groups
	setGroups: createStandardAction('store/groups/set-all')<IKeyValuePair<IGroup>>(),

	// Settings
	setLanguages: createStandardAction('store/settings/set-languages')<ILanguageSetting[]>(),
	setLanguage: createStandardAction('store/settings/set-language')<string>()
};

export default actions;
export type YioStoreActionTypes = ActionType<typeof actions>;
