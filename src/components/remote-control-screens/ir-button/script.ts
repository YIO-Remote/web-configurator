import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator';
import { IButtonConfig } from '../../../types';

@Component({
	name: 'IrButton'
})
export default class IrButton extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public config: IButtonConfig;

	@Emit('onClick')
	public onClick() {
		return this.config;
	}

	public get classes() {
		return {
			small: this.isSmall,
			button: true,
			colour: this.hasColour,
			icon: this.hasIcon,
			disabled: !this.config.enabled,
			enabled: this.config.enabled,
			...(this.hasColour) ? { [`${this.config.colour}`]: true } : {}
		};
	}

	public get iconClasses() {
		return {
			icon: true,
			[`icon-${this.config.icon}`]: true
		};
	}

	public get hasIcon() {
		return !!this.config.icon;
	}

	public get hasText() {
		return !!this.config.text;
	}

	public get hasColour() {
		return !!this.config.colour;
	}

	public get isSmall() {
		return this.config.size === 'small';
	}
}
