import { IState } from '../types';
import config from './config/initial-state';
import supportedIntegrations from './supported-integrations/initial-state';
import availableEntities from './available-entities/initial-state';

const initialState: IState = {
	config,
	supportedIntegrations,
	availableEntities
};

export default initialState;
