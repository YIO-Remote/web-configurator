import { createStandardAction, ActionType } from 'typesafe-actions';
import { IConfigState, IIntegration } from '../../types';

const actions = {
	updateConfig: createStandardAction('store/config/update')<IConfigState>(),
	updateDarkMode: createStandardAction('store/config/settings/update-dark-mode')<boolean>(),
	updateAutoBrightness: createStandardAction('store/config/settings/update-auto-brightness')<boolean>(),
	updateAutoSoftwareUpdate: createStandardAction('store/config/settings/update-auto-software-update')<boolean>(),
	addIntegration: createStandardAction('store/config/settings/add-integration')<IIntegration, string>(),
	updateIntegration: createStandardAction('store/config/settings/update-integration')<IIntegration, string>(),
	removeIntegration: createStandardAction('store/config/settings/remove-integration')<IIntegration>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
