import { IIntegrationsState } from '../../types';

const initialState: IIntegrationsState = {
	configured: {},
	supported: {},
	discovered: [],
	isSearchingForIntegrations: false
};

export default initialState;
