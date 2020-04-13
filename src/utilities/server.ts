import WebSocketAsPromised from 'websocket-as-promised';
import { BehaviorSubject } from 'rxjs';
import { Singleton, Inject } from './dependency-injection';
import { YioStore } from '../store';
import { IConfigState, IKeyValuePair, IIntegrationInstance } from '../types';

@Singleton
export class ServerConnection {
	public isConnected$: BehaviorSubject<boolean>;

	@Inject(() => YioStore)
	private store: YioStore;
	private host: string;
	private port: number;
	private wsp: WebSocketAsPromised;
	private pollingRequestId: number;
	private requestId: number;

	constructor() {
		// TODO: Make this use window.location when in PROD build
		this.host = '192.168.12.123';
		this.port = 946;
		this.requestId = 0;
		this.pollingRequestId = 1316134911;
		this.isConnected$ = new BehaviorSubject<boolean>(false);
		this.wsp = new WebSocketAsPromised(`ws://${this.host}:${this.port}`, {
			packMessage: (data) => JSON.stringify(data),
			unpackMessage: (data) => JSON.parse(data as string),
			attachRequestId: (data, requestId) => Object.assign({id: requestId}, data),
			extractRequestId: (data) => data && data.id
		});
		this.wsp.onClose.addListener(() => {
			this.isConnected$.next(false);
			this.connect();
		});
		this.wsp.onError.addListener(() => this.isConnected$.next(false));
		this.wsp.onResponse.addListener((response) => {
			this.isConnected$.next(true);

			if (response.success && response.id === this.pollingRequestId) {
				this.store.dispatch(this.store.actions.updateConfig(response.config));
				this.pollForData();
			}
		});
	}

	public connect() {
		if (this.isConnected$.value) {
			return Promise.resolve();
		}

		return this.wsp.open()
			.then(() => this.isConnected$.next(true))
			.then(() => this.authenticate('0'))
			.then(() => this.getConfig())
			.then(() => this.getSupportedIntegrations())
			.then(() => {
				this.getIntegrationSetupData('spotify');
			});
	}

	public authenticate(token: string) {
		return this.wsp.send(`{"type": "auth", "token": "${token}"}`);
	}

	public getConfig() {
		return this.wsp.sendRequest({type: 'get_config'}, { requestId: this.pollingRequestId });
	}

	public setConfig(config: IConfigState) {
		return this.sendMessage({type: 'set_config', config});
	}

	public getEntities() {
		return this.sendMessage({type: 'get_loaded_entities'});
	}

	public getSupportedIntegrations(): Promise<string[]> {
		return this.sendMessage({type: 'get_supported_integrations'})
			.then((response) => response.supported_integrations);
	}

	public getIntegrationSetupData(integration: string): Promise<IKeyValuePair<string>> {
		return this.sendMessage({type: 'get_integration_setup_data', integration})
			.then((response) => response.data);
	}

	public getLoadedIntegrations() {
		return this.sendMessage({type: 'get_loaded_integrations'});
	}

	public addIntegration(config: IIntegrationInstance) {
		return this.sendMessage({type: 'add_integration', config});
		// "config": {
		// 	"type": "homeassistant",
		// 	"id": "homeassistant_pro",
		// 	"friendly_name": "My Home Assistant Server",
		// 	"data": {
		// 		"ip": "192.168.0.2",
		// 		"token": "832748hfjkdfu21ytr79218ohfi2"
		// 	}
		// }
	}

	public updateIntegration(config: IIntegrationInstance) {
		return this.sendMessage({type: 'update_integration', config});
		// "config": {
		// 	"type": "homeassistant",
		// 	"id": "homeassistant_pro",
		// 	"friendly_name": "My Home Assistant Server",
		// 	"data": {
		// 		"ip": "192.168.0.2",
		// 		"token": "832748hfjkdfu21ytr79218ohfi2"
		// 	}
		// }
	}

	public removeIntegration(id: string) {
		return this.sendMessage({type: 'remove_integration', integration_id: id });
	}

	public setDarkMode(value: boolean) {
		return this.sendMessage({ type: 'set_dark_mode', value });
	}

	public setAutoBrightness(value: boolean) {
		return this.sendMessage({ type: 'set_auto_brightness', value });
	}

	public getLanguages(value: boolean) {
		return this.sendMessage({ type: 'get_languages', value });
	}

	public setLanguage(value: boolean) {
		return this.sendMessage({ type: 'set_language', value });
	}

	private sendMessage(message: object) {
		this.requestId++;

		return this.wsp.sendRequest(message, {requestId: this.requestId}).then((response) => {
			if (!response.success) {
				return Promise.reject(new Error('API Request Failed'));
			}

			return response;
		});
	}

	private pollForData() {
		window.setTimeout(() => this.getConfig(), 2000);
	}
}
