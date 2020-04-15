import { IState } from '../types';
import config from './config/initial-state';
import integrations from './integrations/initial-state';
import entities from './entities/initial-state';
import profiles from './profiles/initial-state';
import pages from './pages/initial-state';
import groups from './groups/initial-state';

const initialState: IState = {
	config,
	integrations,
	entities,
	profiles,
	pages,
	groups
};

export default initialState;
