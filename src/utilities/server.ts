import WebSocketAsPromised from 'websocket-as-promised';
import { BehaviorSubject } from 'rxjs';
import { Singleton, Inject } from './dependency-injection';
import { YioStore } from '../store';
import { IConfigState, IKeyValuePair, IIntegrationInstance, IEntity, IServerResponse, IServerResponseWithData } from '../types';
import Vue from 'vue';

@Singleton
export class ServerConnection {
	public isConnected$: BehaviorSubject<boolean>;

	@Inject(() => YioStore)
	private store: YioStore;
	private host: string;
	private port: number;
	private wsp: WebSocketAsPromised;
	private configPollingRequestId: number;
	private entitiesPollingRequestId: number;
	private requestId: number;

	constructor() {
		// TODO: Make this use window.location when in PROD build
		this.host = '192.168.12.123';
		this.port = 946;
		this.requestId = 0;
		this.configPollingRequestId = 1316134911;
		this.entitiesPollingRequestId = 1316134910;
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

			if (response.success && response.id === this.configPollingRequestId) {
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
			.then(() => this.getSupportedIntegrations())
			.then((supportedIntegrations) => this.store.dispatch(this.store.actions.updateSupportedIntegrations(supportedIntegrations)))
			.then(() => this.getAvailableEntities())
			.then((availableEntities) => this.store.dispatch(this.store.actions.updateAvailableEntities(availableEntities)))
			.then(() => this.getConfig());
	}

	public authenticate(token: string) {
		return this.wsp.send(`{"type": "auth", "token": "${token}"}`);
	}

	public getConfig() {
		return this.wsp.sendRequest({type: 'get_config'}, { requestId: this.configPollingRequestId })
			.then((response) => response.config);
	}

	public setConfig(config: IConfigState) {
		return this.sendMessage({type: 'set_config', config})
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getEntities() {
		return this.wsp.sendRequest({type: 'get_loaded_entities'}, { requestId: this.entitiesPollingRequestId });
	}

	public addEntity(config: IEntity) {
		return this.sendMessage({type: 'add_entity', config})
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getAvailableEntities() {
		// return this.sendMessage({type: 'get_available_entities'})
		// 	.then((response) => response.config)
			return Promise.resolve({
				id: 22,
				success: true,
				type: 'result',
				available_entities: {
					blind: [
						{
							type: 'blind',
							area: 'Living room',
							entity_id: 'cover.living_room_blinds_level2',
							friendly_name: 'Living room blinds',
							integration: 'homeassistant',
							supported_features: [
								'OPEN',
								'CLOSE',
								'STOP',
								'POSITION'
							]
						}
					],
					light: [
						{
							area: 'Entrance',
							type: 'light',
							entity_id: 'light.livingroom_light_level',
							friendly_name: 'Entrance lamp',
							integration: 'homeassistant',
							supported_features: [
								'BRIGHTNESS'
							]
						},
						{
							area: 'Kitchen',
							type: 'light',
							entity_id: 'light.kitchen_dimmer_level',
							friendly_name: 'Kitchen lamp',
							integration: 'homeassistant',
							supported_features: [
								'BRIGHTNESS',
								'COLOR'
							]
						}
					]
				} as IKeyValuePair<IEntity[]>
			})
			.then((response) => response.available_entities);
	}

	public getSupportedIntegrations(): Promise<IKeyValuePair<object>> {
		return this.sendMessage<string[]>({type: 'get_supported_integrations'})
			.then((response) => response.supported_integrations)
			.then((integrations: string[]) => {
				return integrations.reduce((chain, integration) => {
					return chain.then((previous) => {
						return this.getIntegrationSchema(integration).then((setupData) => {
							previous[integration] = { id: '', friendly_name: '', ...setupData };
							return previous;
						});
					});
				}, Promise.resolve({} as IKeyValuePair<object>));
			});
	}

	public getIntegrationSchema(integration: string): Promise<IKeyValuePair<string>> {
		return this.sendMessage<IKeyValuePair<string>>({type: 'get_integration_setup_data', integration})
			.then((response) => response.data);
	}

	public getLoadedIntegrations() {
		return this.sendMessage({type: 'get_loaded_integrations'});
	}

	public addIntegration(config: IIntegrationInstance) {
		return this.sendMessage({type: 'add_integration', config})
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public updateIntegration(config: IIntegrationInstance) {
		return this.sendMessage({type: 'update_integration', config})
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removeIntegration(id: string) {
		return this.sendMessage({type: 'remove_integration', integration_id: id })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public setDarkMode(value: boolean) {
		return this.sendMessage({ type: 'set_dark_mode', value })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public setAutoBrightness(value: boolean) {
		return this.sendMessage({ type: 'set_auto_brightness', value })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getLanguages(value: boolean) {
		return this.sendMessage({ type: 'get_languages', value });
	}

	public setLanguage(value: boolean) {
		return this.sendMessage({ type: 'set_language', value })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	private sendMessage<T>(message: object) {
		this.requestId++;

		return this.wsp.sendRequest(message, {requestId: this.requestId}).then((response: IServerResponseWithData<T>) => {
			if (!response.success) {
				return Promise.reject(response);
			}

			return response;
		});
	}

	private pollForData() {
		window.setTimeout(() => this.getConfig(), 2000);
		window.setTimeout(() => this.getAvailableEntities(), 5000);
	}

	private showToast(response: IServerResponse) {
		if (response.success) {
			Vue.$toast.success(`Success - ${response.message || 'Config Updated'}`);
			return;
		}

		Vue.$toast.error(`Failed To Update Config - ${response.message || 'API Request Failed'}`);
	}
}
