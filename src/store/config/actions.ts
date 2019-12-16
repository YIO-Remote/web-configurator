import { createStandardAction, ActionType } from "typesafe-actions";
import { IConfigState, UpdateFromServer } from "../../types";

const actions = {
	updateConfig: createStandardAction("store/config/update")<IConfigState, UpdateFromServer>()
};

export default actions;
export type ConfigActionType = ActionType<typeof actions>;
