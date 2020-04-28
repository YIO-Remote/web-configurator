import WebSocketAsPromised from 'websocket-as-promised';
import { BehaviorSubject } from 'rxjs';
import { Guid } from 'guid-typescript';
import { Singleton, Inject } from './utilities/dependency-injection';
import { YioStore } from './store';
import { IConfigState, IKeyValuePair, IIntegrationInstance, IEntity, IServerResponse, IServerResponseWithData, IProfile, IPage, IGroup, IIntegrationSchema, IProfileAggregate, IPageAggregate, IEntityAggregate, IGroupAggregate, ILanguageSetting } from './types';
import Vue from 'vue';
import { Localisation } from './i18n';

@Singleton
export class ServerConnection {
	public isConnected$: BehaviorSubject<boolean>;

	@Inject(() => YioStore)
	private store: YioStore;

	@Inject(() => Localisation)
	private localisation: Localisation;

	private host: string;
	private port: number;
	private wsp: WebSocketAsPromised;
	private configPollingRequestId: number;
	private entitiesPollingRequestId: number;
	private requestId: number;

	constructor() {
		this.host = window.location.hostname;
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
			.then(() =>  this.getLanguages())
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
			.catch(() => ({}));
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
			.then(() => this.reboot())
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

	public addNewProfile(name: string) {
		const profile = {
			[`${Guid.create()}`]: {
				name,
				favorites: [],
				pages: []
			}
		};

		return this.sendMessage({ type: 'add_profile', profile })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getProfiles() {
		return this.sendMessage<IKeyValuePair<IProfile>>({ type: 'get_all_profiles'})
			.then((response) => response.profiles)
			.then((profiles) => this.store.dispatch(this.store.actions.setProfiles(profiles)));
	}

	public setActiveProfile(profile: IProfileAggregate) {
		return this.sendMessage({ type: 'set_profile', profile: profile.id });
	}

	public renameProfile(profile: IProfileAggregate, name: string) {
		const data = {
			name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public deleteProfile(profile: IProfileAggregate) {
		return this.sendMessage({ type: 'remove_profile', profile_id: profile.id })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addPageToProfile(profile: IProfileAggregate, pageToAdd: IPageAggregate) {
		const match = profile.pages.find((page) => page.id === pageToAdd.id);

		if (match) {
			Vue.$toast.error(
				this.localisation.t('toasts.pageAlreadyExists', { name: pageToAdd.name }).toString()
			);
			return;
		}

		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: [
				...profile.pages.map((page) => page.id),
				pageToAdd.id
			]
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removePageFromProfile(profile: IProfileAggregate, pageIdToRemove: string) {
		const indexToRemove = profile.pages.findIndex((page) => page.id === pageIdToRemove);

		if (indexToRemove === -1) {
			Vue.$toast.error(
				this.localisation.t('toasts.pageDoesNotExist').toString()
			);
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

	public updatePageSortOrder(profile: IProfileAggregate, fromIndex: number, toIndex: number) {
		const pageToMove = profile.pages.splice(fromIndex, 1)[0];
		profile.pages.splice(toIndex, 0, pageToMove);

		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addFavorite(profile: IProfileAggregate, entityToAdd: IEntityAggregate) {
		const match = profile.favorites.find((entity) => entity.entity_id === entityToAdd.entity_id);

		if (match) {
			Vue.$toast.error(
				this.localisation.t('toasts.entityAlreadyExists', { name: entityToAdd.friendly_name }).toString()
			);
			return;
		}

		const data = {
			name: profile.name,
			favorites: [
				...profile.favorites.map((entity) => entity.entity_id),
				entityToAdd.entity_id
			],
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removeFavorite(profile: IProfileAggregate, entityToRemove: IEntityAggregate) {
		const indexToRemove = profile.favorites.findIndex((entity) => entity.entity_id === entityToRemove.entity_id);

		if (indexToRemove === -1) {
			Vue.$toast.error(this.localisation.t('toasts.entityDoesNotExist').toString());
			return;
		}

		const favorites = profile.favorites.map((entity) => entity.entity_id);
		favorites.splice(indexToRemove, 1);

		const data = {
			name: profile.name,
			favorites,
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public updateFavoritesSortOrder(profile: IProfileAggregate, fromIndex: number, toIndex: number) {
		const entityToMove = profile.favorites.splice(fromIndex, 1)[0];
		profile.favorites.splice(toIndex, 0, entityToMove);

		const data = {
			name: profile.name,
			favorites: profile.favorites.map((entity) => entity.entity_id),
			pages: profile.pages.map((page) => page.id)
		};

		return this.sendMessage({type: 'update_profile', uuid: profile.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addEntityToGroup(group: IGroupAggregate, entityToAdd: IEntityAggregate) {
		const match = group.entities.find((entity) => entity.entity_id === entityToAdd.entity_id);

		if (match) {
			Vue.$toast.error(
				this.localisation.t('toasts.entityAlreadyExists', { name: entityToAdd.friendly_name }).toString()
			);
			return;
		}

		const data = {
			name: group.name,
			entities: [
				...group.entities.map((entity) => entity.entity_id),
				entityToAdd.entity_id
			]
		};

		return this.sendMessage({type: 'update_group', uuid: group.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removeEntityFromGroup(group: IGroupAggregate, entityToRemove: IEntityAggregate) {
		const indexToRemove = group.entities.findIndex((entity) => entity.entity_id === entityToRemove.entity_id);

		if (indexToRemove === -1) {
			Vue.$toast.error(this.localisation.t('toasts.entityDoesNotExist').toString());
			return;
		}

		const entities = group.entities.map((entity) => entity.entity_id);
		entities.splice(indexToRemove, 1);

		const data = {
			name: group.name,
			entities
		};

		return this.sendMessage({type: 'update_group', uuid: group.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public updateEntitySortOrder(group: IGroupAggregate, fromIndex: number, toIndex: number) {
		const entityToMove = group.entities.splice(fromIndex, 1)[0];
		group.entities.splice(toIndex, 0, entityToMove);

		const data = {
			name: group.name,
			entities: group.entities.map((entity) => entity.entity_id)
		};

		return this.sendMessage({type: 'update_group', uuid: group.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addGroupToPage(page: IPageAggregate, groupToAdd: IGroupAggregate) {
		const match = page.groups.find((group) => group.id === groupToAdd.id);

		if (match) {
			Vue.$toast.error(this.localisation.t('toasts.groupAlreadyExists', { name: groupToAdd.name }).toString());
			return;
		}

		const data = {
			name: page.name,
			image: page.image,
			groups: [
				...page.groups.map((group) => group.id),
				groupToAdd.id
			]
		};

		return this.sendMessage({type: 'update_page', uuid: page.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public removeGroupFromPage(page: IPageAggregate, groupToRemove: IGroupAggregate) {
		const indexToRemove = page.groups.findIndex((group) => group.id === groupToRemove.id);

		if (indexToRemove === -1) {
			Vue.$toast.error(this.localisation.t('toasts.groupDoesNotExist').toString());
			return;
		}

		const groups = page.groups.map((group) => group.id);
		groups.splice(indexToRemove, 1);

		const data = {
			name: page.name,
			image: page.image,
			groups
		};

		return this.sendMessage({type: 'update_page', uuid: page.id, data })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addNewPage(name: string) {
		const page = {
			[`${Guid.create()}`]: {
				name,
				image: '',
				groups: []
			}
		};

		return this.sendMessage({ type: 'add_page', page })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getPages() {
		return this.sendMessage<IKeyValuePair<IPage>>({ type: 'get_all_pages'})
			.then((response) => response.pages)
			.catch((response) => this.showToast(response));
	}

	public deletePage(page: IPageAggregate) {
		return this.sendMessage({ type: 'remove_page', page_id: page.id })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public addNewGroup(name: string) {
		const group = {
			[`${Guid.create()}`]: {
				name,
				entities: []
			}
		};

		return this.sendMessage({ type: 'add_group', group })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getGroups() {
		return this.sendMessage<IKeyValuePair<IGroup>>({ type: 'get_all_groups'})
			.then((response) => response.groups)
			.catch((response) => this.showToast(response));
	}

	public deleteGroup(group: IGroupAggregate) {
		return this.sendMessage({ type: 'remove_group', group_id: group.id })
			.then((response) => this.showToast(response))
			.catch((response) => this.showToast(response));
	}

	public getLanguages() {
		return this.sendMessage<ILanguageSetting[]>({ type: 'get_languages' })
			.then((response) => response.languages)
			.then((languages) => this.store.dispatch(this.store.actions.setLanguages(languages)));
	}

	public setLanguage(language: string) {
		return this.sendMessage({ type: 'set_language', language })
			.then((response) => this.showToast(response))
			.then(() => this.store.dispatch(this.store.actions.setLanguage(language)))
			.catch((response) => this.showToast(response));
	}

	public reboot() {
		return this.sendMessage({ type: 'reboot' })
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
		window.setTimeout(() => this.getConfig(), 3000);
		window.setTimeout(() => this.getAvailableEntities(), 3000);
	}

	private showToast(response: IServerResponse) {
		if (response.success) {
			Vue.$toast.success(this.localisation.t('toasts.configUpdated').toString());
			return;
		}

		const message = response.message || '';
		Vue.$toast.error(this.localisation.t('toasts.configUpdateFailed', { message }).toString());
	}
}
