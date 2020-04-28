import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	name: 'Icon'
})
export default class Icon extends Vue {
	@Prop({
		type: String,
		required: true
	})
	public type: string;

	public get mappedType() {
		if (this.type === 'media_player') {
			return 'music';
		}

		return this.type;
	}

	public get classes() {
		return {
			icon: true,
			[`icon-${this.mappedType}`]: true
		};
	}
}
