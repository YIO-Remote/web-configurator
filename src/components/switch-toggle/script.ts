import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component({
	name: 'SwitchToggle'
})
export default class SwitchToggle extends Vue {
	@Prop({
		type: Boolean,
		required: true
	})
	public readonly value: boolean;

	public get hasSlotContent() {
		return !!(this.$slots.default || this.$scopedSlots.default);
	}
}
