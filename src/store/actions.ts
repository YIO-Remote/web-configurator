import configActions from './config/actions';
import supportedIntegrationsActions from './supported-integrations/actions';
import availableEntities from './available-entities/actions';

const actions = {
	...configActions,
	...supportedIntegrationsActions,
	...availableEntities
};

export default actions;
export type YioStoreActions = typeof actions;
