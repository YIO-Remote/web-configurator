import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { Guid } from 'guid-typescript';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';
import { ServerConnection } from '../../../server';
import { IKeyValuePair, IDropDownItem, IIntegrationSchema } from '../../../types';
import ActionButton from '../../action-button/index.vue';
import ActionIconButton from '../../action-icon-button/index.vue';
import DropDown from '../../drop-down/index.vue';
import Spotify from '../../spotify/index.vue';
import { SpotifyAuthentication } from '../../../utilities/spotify-authentication';

@Component({
	name: 'AddIntegration',
	subscriptions(this: AddIntegration) {
		return {
			supportedIntegrations: this.store.integrations.supported$,
			typeOptions: this.store.integrations.supported$.pipe(map((supportedIntegrations) => Object.keys(supportedIntegrations).map((key) => ({
				text: key,
				value: key
			}))))
		};
	},
	components: {
		ActionButton,
		ActionIconButton,
		DropDown,
		Spotify
	}
})
export default class AddIntegration extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	@Inject(() => SpotifyAuthentication)
	public spotifyAuthentication: SpotifyAuthentication;

	public isAddingNewIntegration: boolean = this.spotifyAuthentication.isInAuthenticationCycle;
	public supportedIntegrations: IKeyValuePair<IIntegrationSchema>;
	public integrationTypeSelected: boolean = false;
	public isIntegrationTypeSelectedSpotify: boolean = this.spotifyAuthentication.isInAuthenticationCycle;
	public typeOptions: IDropDownItem[] = [];
	public name: string = '';
	public type: string = '';
	public properties: IKeyValuePair<IIntegrationSchema> = {};
	public propertyValues: IKeyValuePair<string> = {};
	public newDataKey: string = '';
	public newDataValue: string = '';
	public selectedItem: IDropDownItem = this.isIntegrationTypeSelectedSpotify ?
		{ text: 'spotify', value: 'spotify' } : {} as IDropDownItem;

	public onIntegrationTypeChanged(item: IDropDownItem) {
		const selectedIntegration = this.supportedIntegrations[item.value];
		const properties = selectedIntegration.properties || {};
		const filteredProps = Object.keys(properties)
			.filter((key) => key !== 'entity_id')
			.reduce((values, propName) => {
				return {
					...values,
					[`${propName}`]: properties[propName]
				};
			}, {} as IKeyValuePair<IIntegrationSchema>);

		this.type = item.value;
		this.integrationTypeSelected = true;
		this.isIntegrationTypeSelectedSpotify = (this.type === 'spotify');
		this.properties = { ...filteredProps };
		this.propertyValues = { ...Object.keys(filteredProps)
			.reduce((values, propName) => {
				return {
					...values,
					[`${propName}`]: ''
				};
			}, {} as IKeyValuePair<string>) };
	}

	public onAddNewIntegration() {
		this.isAddingNewIntegration = true;
	}

	public onCancel() {
		this.isAddingNewIntegration = false;
		this.name = '';
		this.type = '';
		this.properties = {};
		this.propertyValues = {};
	}

	public onSave() {
		if (!this.name) {
			return;
		}

		if (!this.type) {
			return;
		}

		this.server.addIntegration({
			id: `${Guid.create()}`,
			type: this.type,
			friendly_name: this.name,
			friendly_name_search_term: this.name,
			data: this.propertyValues
		}).then(() => this.onCancel());
	}
}
