import Vue, { VueConstructor } from 'vue';
import { LocaleMessageObject } from 'vue-i18n';

// Store Types
export interface IStoreState {
	// tslint:disable-next-line:no-any
	[stateSliceKey: string]: any;
}

// tslint:disable-next-line:no-any
export interface IEmptyAction<T = any> {
	type: T;
}

// tslint:disable-next-line:no-any
export interface IAction<T = any> {
	type: T;
	// tslint:disable-next-line:no-any
	payload: any;
	// tslint:disable-next-line:no-any
	meta: any;
}

export interface IAnyEmptyAction extends IEmptyAction {
	// tslint:disable-next-line:no-any
	[extraProps: string]: any;
}

export interface IAnyAction extends IAction {
	// tslint:disable-next-line:no-any
	[extraProps: string]: any;
}

// tslint:disable-next-line:no-any
export type Reducer<S = any, A extends IAction = IAnyAction> = (state: S, action: A) => S;

// tslint:disable-next-line:no-any
export type ReducersMapObject<S = any, A extends IAction = IAction> = {
	[K in keyof S]: Reducer<S[K], A>;
};

export type Reducers<S> = {
	[K in keyof S]: Reducer<S[K]>;
};

export type UpdateFromServer = boolean | undefined;

// State Types
export interface IKeyValuePair<T> {
	[key: string]: T;
}

export interface ISettings {
	language: string;
	autobrightness: boolean;
	proximity: number;
	shutdowntime: number;
	softwareupdate: {
		appUpdateScript: string;
		autoUpdate: boolean;
		channel: string;
		checkInterval: number;
		downloadDir: string;
		systemUpdateScript: string;
		updateUrl: string;
		updateUrlAppPath: string;
	};
	wifitime: number;
	bluetootharea: boolean;
	paired_dock: string;
	logging: {
		console: boolean;
		level: string;
		path: string;
		purgeHours: number;
		queueSize: number;
		showSource: number;
	};
}

export interface IProfile {
	name: string;
	pages: string[];
	favorites: string[];
}

export interface IPage {
	name: string;
	image?: string;
	groups: string[];
	bluetooth?: string;
}

export interface IGroup {
	name: string;
	switch: boolean;
	entities: string[];
}

export interface IEntity {
	type: string;
	entity_id: string;
	integration: string;
	area: string;
	friendly_name: string;
	supported_features: string[];
}

export interface IIntegrationInstance {
	id: string;
	type: string;
	friendly_name: string;
	data: IKeyValuePair<string>;
}

export interface IIntegration {
	mdns?: string;
	data: IIntegrationInstance[];
}

export interface IUiConfig {
	darkmode: boolean;
	selected_profile: string;
	profiles: IKeyValuePair<IProfile>;
	pages: IKeyValuePair<IPage>;
	groups: IKeyValuePair<IGroup>;
}

export interface IConfigState {
	settings: ISettings;
	ui_config: IUiConfig;
	entities: IKeyValuePair<IEntity[]>;
	integrations: IKeyValuePair<IIntegration>;
}

export interface IIntegrationSchema {
	default: any;
	description: string;
	examples: any[];
	friendly_name: string;
	id: string;
	properties: IKeyValuePair<IIntegrationSchema>;
	required: IKeyValuePair<string>;
	title: string;
	type: string;
}

export interface IIntegrationsState {
	configured: IKeyValuePair<IIntegration>;
	supported: IKeyValuePair<IIntegrationSchema>;
}

export interface IEntitiesState {
	loaded: IKeyValuePair<IEntity[]>;
	available: IEntity[];
	supported: string[];
}

export interface IProfilesState {
	all: IKeyValuePair<IProfile>;
}

export interface IPagesState {
	all: IKeyValuePair<IPage>;
}

export interface IGroupsState {
	all: IKeyValuePair<IGroup>;
}

export interface IState {
	config: IConfigState;
	integrations: IIntegrationsState;
	entities: IEntitiesState;
	profiles: IProfilesState;
	pages: IPagesState;
	groups: IGroupsState;
}

export interface IEntityAggregate {
	type: string;
	entity_id: string;
	integration: IIntegrationInstance;
	area: string;
	friendly_name: string;
	supported_features: string[];
}

export interface IGroupAggregate {
	id: string;
	name: string;
	switch: boolean;
	entities: IEntityAggregate[];
}

export interface IPageAggregate {
	id: string;
	name: string;
	image?: string;
	groups: IGroupAggregate[];
}

export interface IProfileAggregate {
	id: string;
	name: string;
	initial: string;
	pages: IPageAggregate[];
	favorites: IEntityAggregate[];
}

// Locale
export interface ILocale extends LocaleMessageObject {
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

// Server
export interface IServerResponse {
	type: string;
	success: boolean;
	id: number;
	message?: string;
}

export interface IServerResponseWithData<T> extends IServerResponse {
	config: T;
	groups: T;
	pages: T;
	profiles: T;
	available_entities: T;
	supported_entities: T;
	supported_integrations: T;
	data: T;
}

// Plugins
export interface IMenuPlugin {
	isVisible: boolean;
	instance?: any;
}

export interface IContextMenu {
	getComponent<T extends Vue>(): T;
	hide(): void;
	show<T extends object>(component: VueConstructor<Vue>, props: T): void;
}

export interface IToastOptions {
	message: string;
	type: 'success' | 'info' | 'warning' | 'error';
	position: 'top' | 'bottom' | 'top-right' | 'bottom-right' | 'top-left' | 'bottom-left';
	duration?: number;
	dismissible?: boolean;
	onClick?: () => void;
	onClose?: () => void;
	queue?: boolean;
}

export interface IToast {
	open: (options: IToastOptions) => void;
	success: (message: string, options?: IToastOptions) => void;
	error: (message: string, options?: IToastOptions) => void;
	info: (message: string, options?: IToastOptions) => void;
	warning: (message: string, options?: IToastOptions) => void;
	clear: () => void;
}

// Components
export interface ICardComponent extends Vue {
	isSelected: boolean;
	setSelected(isSelected: boolean): void;
}

export interface ICardListComponent extends Vue {
	addCard(card: ICardComponent): void;
	removeCard(card: ICardComponent): void;
	selectCard(cardToSelect: ICardComponent): void;
	deselect(): void;
}

export interface ITabComponent extends Vue {
	setIsActive(isActive: boolean): void;
	selectCard(cardToSelect: ICardComponent): void;
}

export interface IYioTableComponent extends Vue {
	deselect(): void;
}

export interface IDropDownItem {
	text: string;
	value: string;
}
