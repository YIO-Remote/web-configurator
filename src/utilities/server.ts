import { Subscription } from 'rxjs';
import { Singleton, Inject } from './dependency-injection';
import { YioStore } from '../store';
import { IConfig } from '../types';
import { skip } from 'rxjs/operators';

@Singleton
export class ServerConnection {
    @Inject(() => YioStore)
    private store: YioStore;

    private host: string;
    private port: number;
    private socket: WebSocket | null;

    constructor() {
        this.host = '192.168.12.20';
        this.port = 946;
    }

    public connect() {
        this.socket = new WebSocket(`ws://${this.host}:${this.port}`);
        this.socket.onopen = () => this.onOpen('0');
        this.socket.onmessage = (event) => this.onMessage(event);
        this.socket.onclose = (event) => this.onClose(event);
        this.socket.onerror = (event) => this.onError(event);
    }

    public setConfig(config: IConfig) {
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

        if (message.type && message.type === "auth_ok") {
            this.getConfig();
        }

        if (message.type && message.type === "config") {
            this.store.dispatch(this.store.actions.updateConfig(message.config, true));
            this.pollForData();
        }
    }

    private onClose(event: CloseEvent) {
        if (event.wasClean) {
            console.log(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
        } else {
            console.log("[close] Connection died");
        }

        this.socket = null;
    }

    private pollForData() {
        window.setTimeout(() => this.getConfig(), 5000);
    } 

    private onError(event: Event) {
        console.log(`[error] ${event}`);
    }
}
