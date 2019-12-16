import configActions from "./config/actions";
const actions = {
	...configActions,
};

export default actions;
export type YioStoreActions = typeof actions;
