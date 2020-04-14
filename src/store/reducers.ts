import { combineReducers } from '../utilities/store';
import config from './config/reducer';
import integrations from './integrations/reducer';
import entities from './entities/reducer';

export default combineReducers({
	config,
	integrations,
	entities
});
