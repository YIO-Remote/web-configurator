import axios from 'axios';
import { Singleton } from './dependency-injection';
import { getQueryString, stringifyFormParams } from './querystring';

@Singleton
export class SpotifyAuthentication {
	public isInAuthenticationCycle: boolean = false;
	public accessToken: string = '';
	public refreshToken: string = '';
	public expiresIn: number = 0;
	public scopes = [
		'user-read-playback-state',
		'user-modify-playback-state',
		'user-read-currently-playing',
		'streaming',
		'app-remote-control',
		'playlist-read-collaborative',
		'playlist-read-private',
		'user-library-read',
		'user-top-read',
		'user-read-playback-position',
		'user-read-recently-played'
	];

	constructor() {
		const queryString = getQueryString();
		this.isInAuthenticationCycle = !!queryString.code;
	}

	public authenticate(clientId: string, redirectUrl: string) {
		const endpoint = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(this.scopes.join(' '))}&redirect_uri=${encodeURIComponent(redirectUrl)}`;
		location.href = endpoint;
	}

	public requestTokens(clientId: string, clientSecret: string, redirectUrl: string) {
		const queryString = getQueryString();

		return axios.post('https://accounts.spotify.com/api/token', stringifyFormParams({
			grant_type: 'authorization_code',
			code: queryString.code as string,
			redirect_uri: redirectUrl
		}), {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
			}
		}).then((response) => this.setTokenValues(response.data)).catch((error) => console.log(error));
	}

	public reset() {
		this.isInAuthenticationCycle = false;
		this.accessToken = '';
		this.refreshToken = '';
		this.expiresIn = 0;
	}

	private setTokenValues(data: any) {
		this.accessToken = data.access_token;
		this.refreshToken = data.refresh_token;
		this.expiresIn = data.expires_in;
	}
}
