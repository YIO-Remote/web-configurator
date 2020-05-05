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
export enum ButtonMap {
	// power control
	C_POWER_OFF,
	C_POWER_ON,
	C_POWER_TOGGLE,

	// navigation
	C_CURSOR_UP,
	C_CURSOR_DOWN,
	C_CURSOR_LEFT,
	C_CURSOR_RIGHT,
	C_CURSOR_OK,
	C_BACK,
	C_HOME,
	C_MENU,
	C_EXIT,
	C_APP,

	// tuner
	C_CHANNEL_UP,
	C_CHANNEL_DOWN,
	C_CHANNEL_SEARCH,
	C_FAVORITE,
	C_GUIDE,

	// volume
	C_VOLUME_UP,
	C_VOLUME_DOWN,
	C_MUTE_TOGGLE,

	// media controls
	C_PLAY,
	C_PAUSE,
	C_PLAYTOGGLE,
	C_STOP,
	C_FORWARD,
	C_BACKWARD,
	C_NEXT,
	C_PREVIOUS,
	C_INFO,
	C_RECORDINGS,
	C_RECORD,
	C_LIVE,

	// digits
	C_DIGIT_0,
	C_DIGIT_1,
	C_DIGIT_2,
	C_DIGIT_3,
	C_DIGIT_4,
	C_DIGIT_5,
	C_DIGIT_6,
	C_DIGIT_7,
	C_DIGIT_8,
	C_DIGIT_9,
	C_DIGIT_10,
	C_DIGIT_10plus,
	C_DIGIT_11,
	C_DIGIT_12,
	C_DIGIT_SEPARATOR,
	C_DIGIT_ENTER,
	C_FUNCTION_RED,
	C_FUNCTION_GREEN,
	C_FUNCTION_YELLOW,
	C_FUNCTION_BLUE,
	C_FUNCTION_ORANGE,

	// source selection
	C_SOURCE,
	C_INPUT_TUNER_1,
	C_INPUT_TUNER_2,
	C_INPUT_TUNER_X,
	C_INPUT_HDMI_1,
	C_INPUT_HDMI_2,
	C_INPUT_HDMI_X,
	C_INPUT_X_1,
	C_INPUT_X_2,

	// UNKNOWNS
	C_FORMAT_16_9,
	C_FORMAT_4_3,
	C_FORMAT_AUTO,
	C_OUTPUT_HDMI_1,
	C_OUTPUT_HDMI_2,
	C_OUTPUT_DVI_1,
	C_OUTPUT_AUDIO_X,
	C_OUTPUT_X,
	C_SERVICE_NETFLIX,
	C_SERVICE_HULU
}

export interface IRemoteEntityAggregate extends IEntityAggregate {
	commands: IRemoteCommand[];
}

export interface IRemoteCommand {
	button_map: ButtonMap;
	code: string;
}

export interface IKeyValuePair<T> {
	[key: string]: T;
}

export interface ILanguageSetting {
	name: string;
	id: string;
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
	friendly_name_search_term: string;
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

export interface ISettingsState {
	languages: ILanguageSetting[];
}

export interface IConfigState {
	settings: ISettings;
	ui_config: IUiConfig;
	entities: IKeyValuePair<IEntity[]>;
	integrations: IKeyValuePair<IIntegration>;
}

export interface IIntegrationSchema {
	description: string;
	examples: string[];
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
	settings: ISettingsState;
}

export interface IEntityAggregate {
	type: string;
	entity_id: string;
	integration: IIntegrationInstance;
	area: string;
	friendly_name: string;
	friendly_name_search_term: string;
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
	header: {
		title: string;
		version: string;
	};
	menu: {
		integrations: string;
		entities: string;
		profiles: string;
		settings: string;
		irLearning: string;
		softwareUpdate: string;
		advanced: string;
	};
	components: {

	};
	general: {
		settings: string;
		name: string;
		type: string;
		save: string;
		cancel: string;
		pleaseSelect: string;
	};
	pages: {
		integrations: {
			configuredIntegrations: string;
			discoveredIntegrations: string;
			addIntegration: string;
			newIntegration: string;
		};
		entities: {
			title: string;
			availableEntities: string;
		};
		profiles: {};
		irLearning: {};
		softwareUpdate: {};
		advanced: {};
		settings: {
			darkMode: {
				title: string;
			};
			autoBrightness: {
				title: string;
				description: string;
			};
			autoSoftware: {
				key: string;
				description: string;
			};
		}
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
	languages: T;
	groups: T;
	pages: T;
	profiles: T;
	available_entities: T;
	supported_entities: T;
	supported_integrations: T;
	data: T;
}

// Plugins
export interface IDialogPlugin {
	info(options: IDialogOptions): Promise<void>;
	warning(options: IDialogOptions): Promise<void>;
	close(): void;
}

export interface IToastPlugin {
	success(message: string, duration?: number): void;
	info(message: string, duration?: number): void;
	error(message: string, duration?: number): void;
	clear(): void;
}

export interface IDialogOptions {
	title: string;
	message: string;
	showButtons?: boolean;
	static?: boolean;
}

export interface IMenuPlugin {
	isVisible: boolean;
	instance?: Vue;
}

export interface IContextMenu {
	getComponent<T extends Vue>(): T;
	hide(): void;
	show<T extends object>(component: VueConstructor<Vue>, props: T): void;
}

// Components
export interface IDropDownComponent extends Vue {
	resetSelection(item?: IDropDownItem): void;
}

export interface IDialogComponent extends Vue {
	promise: Promise<boolean>;
}

export interface IToastComponent extends Vue {
	hide(): Promise<void>;
}

export interface ICardComponent extends Vue {
	// tslint:disable-next-line:no-any
	data: any;
	isSelected: boolean;
	setSelected(isSelected: boolean): void;
}

export interface ICardListComponent extends Vue {
	$parent: ICardListComponent;
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

export interface IVueAce extends Element {
	$ace: IAceEditor;
}

export interface IAceEditor {
	getSession(): IAceEditorSession;
	setValue(value: string): void;
	resize(): void;
}

export interface IAceEditorSession {
	getValue(): string;
	foldAll(index: number): void;
}

export interface ISpotifyTokenData {
	access_token: string;
	refresh_token: string;
	expires_in: number;
}
