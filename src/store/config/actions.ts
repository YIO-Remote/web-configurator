import { createStandardAction, ActionType } from 'typesafe-actions';
import { IConfigState } from '../../types';

const actions = {
	updateConfig: createStandardAction('store/config/update')<IConfigState>(),
	updateDarkMode: createStandardAction('store/config/settings/update-dark-mode')<boolean>(),
	updateAutoBrightness: createStandardAction('store/config/settings/update-auto-brightness')<boolean>(),
	updateAutoSoftwareUpdate: createStandardAction('store/config/settings/update-auto-software-update')<boolean>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
