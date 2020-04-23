import WebSocketAsPromised from 'websocket-as-promised';
import { BehaviorSubject } from 'rxjs';
import { Singleton, Inject } from './utilities/dependency-injection';
import { YioStore } from './store';
import { IConfigState, IKeyValuePair, IIntegrationInstance, IEntity, IServerResponse, IServerResponseWithData, IProfile, IPage, IGroup, IIntegrationSchema, IProfileAggregate, IPageAggregate } from './types';
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
		this.host = '127.0.0.1';
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
			.then(() => this.getSupportedEntityTypes())
			.then(() => this.getProfiles())
			.then(() => this.getConfig(true))
			.then(() => this.getAvailableEntities())
			.then(() => this.pollForData());
	}

	public authenticate(token: string) {
		return this.wsp.send(`{"type": "auth", "token": "${token}"}`);
	}

	public getConfig(isInitialRequest: boolean = false) {
		if (isInitialRequest) {
			return this.sendMessage<IConfigState>({type: 'get_config'})
				.then((response) => response.config)
				.then((config) => this.store.dispatch(this.store.actions.updateConfig(config)));
		}

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

	public removeEntity(id: string) {
		return this.sendMessage({type: 'remove_entity', entity_id: id})
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getSupportedEntityTypes() {
		return this.sendMessage<string[]>({type: 'get_supported_entities'})
			.then((response) => response.supported_entities)
			.then((supported) => this.store.dispatch(this.store.actions.setSupportedEntityTypes(supported)));
	}

	public getAvailableEntities() {
		return this.sendMessage<IEntity[]>({type: 'get_available_entities'})
			.then((response) => response.available_entities)
			.then((entities) => this.store.dispatch(this.store.actions.setAvailableEntities(entities)))
			.catch(() => {});
	}

	public getSupportedIntegrations(): Promise < void > {
		return this.sendMessage<string[]>({type: 'get_supported_integrations'})
			.then((response) => response.supported_integrations)
			.then((integrations: string[]) => {
				return integrations.reduce((chain, integration) => {
					return chain.then((previous) => {
						return this.getIntegrationSchema(integration).then((setupData) => {
							previous[integration] = setupData;
							return previous;
						});
					});
				}, Promise.resolve({} as IKeyValuePair<IIntegrationSchema>));
			})
			.then((integrations) => this.store.dispatch(this.store.actions.setSupportedIntegrations(integrations)));
	}

	public getIntegrationSchema(integration: string): Promise < IIntegrationSchema > {
		return this.sendMessage<IIntegrationSchema>({type: 'get_integration_setup_data', integration})
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

	public getProfiles() {
		return this.sendMessage<IKeyValuePair<IProfile>>({ type: 'get_all_profiles'})
			.then((response) => response.profiles)
			.then((profiles) => this.store.dispatch(this.store.actions.setProfiles(profiles)));
	}

	public addPageToProfile(profile: IProfileAggregate, pageToAdd: IPageAggregate) {
		const match = profile.pages.find((page) => page.id === pageToAdd.id);

		if (match) {
			Vue.$toast.warning(`Page "${pageToAdd.name}" Already Exists In Profile`);
			return;
		}

		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: [
				...(pageToAdd.id === 'favorites' ? [pageToAdd.id] : []),
				...profile.pages.map((page) => page.id),
				...(pageToAdd.id !== 'favorites' && pageToAdd.id !== 'settings' ? [pageToAdd.id] : []),
				...(pageToAdd.id === 'settings' ? [pageToAdd.id] : []),
			]
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removePageFromProfile(profile: IProfileAggregate, pageIdToRemove: string) {
		const indexToRemove = profile.pages.findIndex((page) => page.id === pageIdToRemove);

		if (indexToRemove === -1) {
			Vue.$toast.warning(`Could Not Remove Page - It Does Not Exist In Profile`);
			return;
		}

		const pages = profile.pages.map((page) => page.id);
		pages.splice(indexToRemove, 1);

		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public updateProfile(profile: IProfileAggregate) {
		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getPages() {
		return this.sendMessage<IKeyValuePair<IPage>>({ type: 'get_all_pages'})
			.then((response) => response.pages)
			.then((pages) => this.store.dispatch(this.store.actions.setPages(pages)));
	}

	public getGroups() {
		return this.sendMessage<IKeyValuePair<IGroup>>({ type: 'get_all_groups'})
			.then((response) => response.groups)
			.then((groups) => this.store.dispatch(this.store.actions.setGroups(groups)));
	}

	public getLanguages(value: boolean) {
		return this.sendMessage({ type: 'get_languages', value });
	}

	public setLanguage(value: boolean) {
		return this.sendMessage({ type: 'set_language', value })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	// tslint:disable-next-line:no-any
	private sendMessage<T>(message: any) {
		this.requestId++;

		return this.wsp.sendRequest(message, {requestId: this.requestId})
		.then((response: IServerResponseWithData<T>) => {
			if (!response.success) {
				return Promise.reject(response);
			}

			if (message.type !== 'get_config') {
				this.getConfig(true);
			}
			return response;
		});
	}

	private pollForData() {
		window.setTimeout(() => this.getConfig(), 10000);
		window.setTimeout(() => this.getAvailableEntities(), 10000);
	}

	private showToast(response: IServerResponse) {
		if (response.success) {
			Vue.$toast.success(`Success - ${response.message || 'Config Updated'}`);
			return;
		}

		Vue.$toast.error(`Failed To Update Config - ${response.message || 'API Request Failed'}`);
	}
}
