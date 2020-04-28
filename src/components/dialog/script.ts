import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionButton from '../action-button/index.vue';
import Icon from '../icon/index.vue';

@Component({
	name: 'Dialog',
	components: {
		ActionButton,
		Icon
	}
})
export default class Dialog extends Vue {
	@Prop({
		type: String,
		required: true,
		default: 'info'
	})
	public type: string;

	@Prop({
		type: String,
		required: true
	})
	public title: string;

	@Prop({
		type: String,
		required: true
	})
	public message: string;

	@Prop({
		type: Boolean,
		required: false,
		default: true
	})
	public showButtons: boolean;

	@Prop({
		type: Boolean,
		required: false,
		default: false
	})
	public static: boolean;
	public promise: Promise<boolean>;
	public resolve: () => void;
	public reject: () => void;

	public get mappedType() {
		if (this.type === 'info') {
			return 'about';
		}

		return this.type;
	}

	public created() {
		// tslint:disable-next-line:no-unused-expression
		this.promise = new Promise((resolve, reject) => {
			this.resolve = resolve;
			this.reject = reject;
		});
	}

	public onBackgroundClick() {
		if (!this.showButtons && !this.static) {
			this.onButtonClick(true);
		}
	}

	public onButtonClick(isConfirm: boolean) {
		if (isConfirm) {
			this.resolve();
		} else {
			this.reject();
		}
	}
}
