import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionButton from '../action-button/index.vue';
import Icon from '../icon/index.vue';

@Component({
	name: 'Toast',
	components: {
		ActionButton,
		Icon
	}
})
export default class Toast extends Vue {
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
	public message: string;
	public isVisible: boolean = false;

	public get mappedType() {
		if (this.type === 'info') {
			return 'bell';
		}

		if (this.type === 'success') {
			return 'about';
		}

		return this.type;
	}

	public mounted() {
		window.setTimeout(() => this.isVisible = true, 100);
	}

	public hide() {
		this.isVisible = false;
		return new Promise((resolve) => window.setTimeout(() => {
			resolve();
		}, 750));
	}
}
