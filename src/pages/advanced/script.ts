import Vue from 'vue';
import { distinctUntilChanged } from 'rxjs/operators';
import { IVueCodeMirror } from 'vue-codemirror';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { ServerConnection } from '../../server';
import ActionButton from '../../components/action-button/index.vue';

@Component({
	name: 'AdvancedPage',
	components: {
		ActionButton
	},
	beforeRouteLeave(this: AdvancedEditPage, _, __, next) {
		const storeConfigValue = JSON.stringify(this.store.value.config, null, 4);
		const editorConfigValue = this.editor.getValue();

		if (storeConfigValue === editorConfigValue) {
			return next();
		}

		this.$dialog.warning({
			title: this.$t('dialogs.unsavedChanges.title').toString(),
			message: this.$t('dialogs.unsavedChanges.message').toString(),
			showButtons: true
		}).then(() => next()).catch(() => next(false));
	}
})
export default class AdvancedEditPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public $cm: HTMLElement;
	public code: string = JSON.stringify(this.store.value.config, null, 4);
	public options = {
		autofocus: true,
		lineNumbers: true,
		lineWrap: false,
		foldGutter: true,
		gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
		theme: 'ayu-dark',
		mode: {
			name: 'javascript',
			json: true
		}
	};

	public get editor() {
		return (this.$refs.cm as IVueCodeMirror).codemirror;
	}

	public async save() {
		const config = this.editor.getValue();

		this.$dialog.warning({
			title: this.$t('dialogs.areYouSure.title').toString(),
			message: this.$t('dialogs.areYouSure.message').toString(),
			showButtons: true
		})
		.then(() => this.server.setConfig(JSON.parse(config)))
		.then(() => this.editor.execCommand('foldAll'))
		.catch(() => this.editor.setValue(config));
	}

	public mounted() {
		this.$subscribeTo(
			this.store.select('config').pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))),
			(value) => {
				this.code = JSON.stringify(value, null, 4);
				this.editor.setValue(this.code);
			});
	}
}
