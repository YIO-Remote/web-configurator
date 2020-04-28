import Vue from 'vue';
import { distinctUntilChanged } from 'rxjs/operators';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { ServerConnection } from '../../server';
import ActionButton from '../../components/action-button/index.vue';
import { IAceEditor, IVueAce } from '../../types';

@Component({
	name: 'AdvancedPage',
	components: {
		ActionButton
	},
	beforeRouteLeave(this: AdvancedEditPage, _, __, next) {
		const storeConfigValue = JSON.stringify(this.store.value.config, null, 4);
		const editorConfigValue = this.$ace.getSession().getValue();

		if (storeConfigValue === editorConfigValue) {
			return next();
		}

		this.$dialog.warning({
			title: this.$t('pages.advanced.unsavedChanges').toString(),
			message: this.$t('pages.advanced.unsavedChangesWarning').toString(),
			showButtons: true
		}).then(() => next()).catch(() => next(false));
	}
})
export default class AdvancedEditPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public $ace: IAceEditor;
	public code: string = JSON.stringify(this.store.value.config, null, 4);
	public config = {
		lang: 'json',
	};

	public async save() {
		const config = this.$ace.getSession().getValue();

		this.$dialog.warning({
			title: this.$t('pages.advanced.areYouSure').toString(),
			message: this.$t('pages.advanced.areYouSureWarning').toString(),
			showButtons: true
		})
		.then(() => this.server.setConfig(JSON.parse(config)))
		.then(() => this.$ace.getSession().foldAll(1))
		.catch(() => this.$ace.setValue(config));
	}

	public mounted() {
		this.$ace = ((this.$refs.ace as IVueAce).$ace as IAceEditor);

		this.$subscribeTo(
			this.store.select('config').pipe(distinctUntilChanged((x, y) => JSON.stringify(x) === JSON.stringify(y))),
			(value) => {
				this.code = JSON.stringify(value, null, 4);
				this.$ace.setValue(this.code);
				this.$ace.resize();
				this.$nextTick().then(() => this.$ace.getSession().foldAll(1));
			});
	}
}
