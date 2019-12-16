// Store Types
export interface IStoreState {
	[stateSliceKey: string]: any;
}

export interface IEmptyAction<T = any> {
	type: T;
}

export interface IAction<T = any> {
	type: T;
	payload: any;
	meta: any;
}

export interface IAnyEmptyAction extends IEmptyAction {
	[extraProps: string]: any;
}

export interface IAnyAction extends IAction {
	[extraProps: string]: any;
}

export type Reducer<S = any, A extends IAction = IAnyAction> = (state: S, action: A) => S;

export type ReducersMapObject<S = any, A extends IAction = IAction> = {
	[K in keyof S]: Reducer<S[K], A>;
};

export type Reducers<S> = {
	[K in keyof S]: Reducer<S[K]>;
};

export type UpdateFromServer = boolean | undefined;

// State Types
export interface ISettings {
	language: string;
	autobrightness: boolean;
	proximity: number;
	shutdowntime: number;
	softwareupdate: boolean;
	wifitime: number;
	bluetootharea: boolean;
	paired_dock: string;
}

export interface IProfile {
	name: string;
	pages: string[];
	favorites: string[];
}

export interface IPage {
	name: string;
	groups: string[];
	image?: string;
	bluetooth?: string;
}

export interface IGroup {
	name: string;
	switch: boolean;
	entities: string[];
}

export interface IEntity {
	entity_id: string;
	friendly_name: string;
	integration: string;
	supported_features: string[];
}

export interface IIntegrationData {
	friendly_name: string;
	id: string;
	data?: {
		ip?: string;
	};
}

export interface IIntegration {
	mdns?: string;
	data: IIntegrationData[];
}

export interface IUiConfig {
	darkmode: boolean;
	selected_profile: number;
	profiles: {
		[key: string]: IProfile;
	};
	pages: {
		[key: string]: IPage;
	};
	groups: {
		[key: string]: IPage;
	};
}

export interface IConfigState {
	settings: ISettings;
	ui_config: IUiConfig;
	entities: {
		[key: string]: IEntity[];
	};
	integrations: {
		[key: string]: IIntegration;
	};
}

export interface IState {
	config: IConfigState;
}

// Locale
export interface ILocale {
	settingsPage: {
		darkMode: string;
		autoBrightness: string;
	};
	disconnectionOverlay: {
		title: string;
		message: string;
		reconnecting: string;
	};
}
