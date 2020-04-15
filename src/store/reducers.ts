import { combineReducers } from '../utilities/store';
import config from './config/reducer';
import integrations from './integrations/reducer';
import entities from './entities/reducer';
import profiles from './profiles/reducer';
import pages from './pages/reducer';
import groups from './groups/reducer';

export default combineReducers({
	config,
	integrations,
	entities,
	profiles,
	pages,
	groups
});
