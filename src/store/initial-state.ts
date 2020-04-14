import { IState } from '../types';
import config from './config/initial-state';
import integrations from './integrations/initial-state';
import entities from './entities/initial-state';

const initialState: IState = {
	config,
	integrations,
	entities
};

export default initialState;
