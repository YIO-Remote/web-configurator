import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Guid } from 'guid-typescript';
import { Inject } from '../../utilities/dependency-injection';
import { SpotifyAuthentication } from '../../utilities/spotify-authentication';
import ActionButton from '../action-button/index.vue';
import TextInput from '../text-input/index.vue';
import { ServerConnection } from '../../server';

@Component({
	name: 'Spotify',
	components: {
		ActionButton,
		TextInput
	}
})
export default class Spotify extends Vue {
	@Inject(() => SpotifyAuthentication)
	public spotifyAuthentication: SpotifyAuthentication;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public name: string = '';
	public clientId: string = '';
	public clientSecret: string = '';
	public accessToken: string = '';
	public redirectUrl: string = `${window.location.origin}`;

	public get isInAuthenticationCycle() {
		return this.spotifyAuthentication.isInAuthenticationCycle;
	}

	public mounted() {
		if (this.spotifyAuthentication.isInAuthenticationCycle) {
			const options = JSON.parse(window.sessionStorage.getItem('yio.spotify') || '{}');
			window.sessionStorage.removeItem('yio.spotify');

			if (!options.name || !options.clientId || !options.clientSecret) {
				this.$toast.error('Sorry - Something went wrong, please try again');
				return;
			}

			this.name = options.name;
			this.clientId = options.clientId;
			this.clientSecret = options.clientSecret;

			this.spotifyAuthentication.requestTokens(this.clientId, this.clientSecret, this.redirectUrl)
				.then(() => this.accessToken = this.spotifyAuthentication.accessToken);
		}
	}

	public beforeDestroy() {
		this.onCancel();
	}

	public onAuthenticate() {
		if (!this.clientId) {
			this.$toast.error('Please enter a client ID');
			return;
		}

		if (!this.clientSecret) {
			this.$toast.error('Please enter a client secret');
			return;
		}

		window.sessionStorage.setItem('yio.spotify', JSON.stringify({
			name: this.name,
			clientId: this.clientId,
			clientSecret: this.clientSecret
		}));

		this.spotifyAuthentication.authenticate(this.clientId, this.redirectUrl);
	}

	public onCancel() {
		this.name = '';
		this.clientId = '';
		this.clientSecret = '';
		this.accessToken = '';
		window.sessionStorage.removeItem('yio.spotify');
		this.spotifyAuthentication.reset();
	}

	public onSave() {
		this.server.addIntegration({
			id: `spotify_${`${Guid.create()}`.substr(0, 4)}`,
			friendly_name: this.name,
			type: 'spotify',
			data: {
				entity_id: `${Guid.create()}`,
				client_id: this.clientId,
				client_secret: this.clientSecret,
				access_token: this.accessToken
			}
		})
		.then(() => this.onCancel())
		.catch(() => this.onCancel());
	}
}
