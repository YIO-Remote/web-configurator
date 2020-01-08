import { createStandardAction, ActionType } from 'typesafe-actions';
import { IConfigState, UpdateFromServer } from '../../types';

const actions = {
	updateConfig: createStandardAction('store/config/update')<IConfigState, UpdateFromServer>(),
	updateDarkMode: createStandardAction('store/config/settings/update-dark-mode')<boolean, UpdateFromServer>(),
	updateAutoBrightness: createStandardAction('store/config/settings/update-auto-brightness')<boolean, UpdateFromServer>(),
	updateAutoSoftwareUpdate: createStandardAction('store/config/settings/update-auto-software-update')<boolean, UpdateFromServer>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
