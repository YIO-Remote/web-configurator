import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { ServerConnection } from '../../utilities/server';
import ActionButton from '../../components/action-button/index.vue';

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

		const result = window.confirm('You will lose any unsaved changes, are you sure?');
		next(result === true ? undefined : result);
	}
})
export default class AdvancedEditPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	@Inject(() => ServerConnection)
	public server: ServerConnection;

	public $ace: any;
	public code: string = JSON.stringify(this.store.value.config, null, 4);
	public config = {
		lang: 'json',
	};

	public async save() {
		const config = this.$ace.getSession().getValue();

		try {
			await this.server.setConfig(JSON.parse(config));
			this.$toast.success('Successfully Updated Config');
		} catch (error) {
			this.$ace.getSession().setValue(config);
			this.$toast.error(`Failed To Update Config - ${error.message}`);
		}
	}

	public mounted() {
		this.$ace = (this.$refs.ace as any).$ace;

		this.$subscribeTo(this.store.select('config'), (value) => {
			this.code = JSON.stringify(value, null, 4);
			this.$ace.setValue(this.code);
			this.$ace.resize();
			this.$nextTick().then(() => this.$ace.getSession().foldAll(1));
		});
	}
}
