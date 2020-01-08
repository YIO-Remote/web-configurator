import { BehaviorSubject } from 'rxjs';
import { YioStore } from '../store';
import { IConfigState } from '../types';
import { Inject, Singleton } from './dependency-injection';

@Singleton
export class ServerConnection {
	public isConnected$: BehaviorSubject<boolean>;

	@Inject(() => YioStore)
	private store: YioStore;
	private host: string;
	private port: number;
	private socket: WebSocket | null;

	constructor() {
		this.host = '192.168.12.52';
		this.port = 946;
		this.isConnected$ = new BehaviorSubject<boolean>(false);
	}

	public connect() {
		this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
		this.socket.onopen = () => this.onOpen('0');
		this.socket.onmessage = (event) => this.onMessage(event);
		this.socket.onclose = (event) => this.onClose(event);
		this.socket.onerror = (event) => this.onError(event);
	}

	public setConfig(config: IConfigState) {
		if (!this.socket) {
			console.log(`[error] Tried to get config on a closed socket`);
			return;
		}

		this.socket.send(`{"type":"setconfig", "config":${JSON.stringify(config)}}`);
	}

	private getConfig() {
		if (!this.socket) {
			console.log(`[error] Tried to get config on a closed socket`);
			return;
		}

		this.socket.send(`{"type":"getconfig"}`);
	}

	private onOpen(token: string) {
		if (!this.socket) {
			console.log(`[error] Tried to open a closed socket without reconnecting`);
			return;
		}

		this.socket.send(`{"type":"auth","token": "${token}"}`);
	}

	private onMessage(event: MessageEvent) {
		const message = JSON.parse(event.data);

		if (message.type && message.type === 'auth_ok') {
			this.getConfig();
		}

		if (message.type && message.type === 'config') {
			this.isConnected$.next(true);
			this.store.dispatch(this.store.actions.updateConfig(message.config, true));
			this.pollForData();
		}
	}

	private onClose(event: CloseEvent) {
		if (event.wasClean) {
			console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
		} else {
			window.setTimeout(() => this.connect(), 5000);
			console.log('[close] Connection died');
		}

		this.socket!.close();
		this.socket = null;
		this.isConnected$.next(false);
	}

	private pollForData() {
		window.setTimeout(() => this.getConfig(), 5000);
	}

	private onError(event: Event) {
		console.log(`[error] %o`, event);
	}
}
