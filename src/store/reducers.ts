import { combineReducers } from '../utilities/store';
import config from './config/reducer';
import supportedIntegrations from './supported-integrations/reducer';
import availableEntities from './available-entities/reducer';

export default combineReducers({
	config,
	supportedIntegrations,
	availableEntities
});
