import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
	name: "Card"
})
export default class Card extends Vue {
	@Prop({
		type: String,
		required: true
	})
	public title: string;
	public isSelected: boolean = false;

	public get isInCardList() {
		return (typeof (this.$parent as any).addCard === "function");
	}

	public get hasLeftIconContent() {
		return this.$slots.leftIcon || this.$scopedSlots.leftIcon;
	}

	public get hasRightIconContent() {
		return this.$slots.rightIcon || this.$scopedSlots.rightIcon;
	}

	public get hasBodyContent() {
		return this.$slots.body || this.$scopedSlots.body;
	}

	public get cardClasses() {
		return {
			"card": true,
			"is-selected": this.isSelected
		};
	}

	public get bodyContainerClasses() {
		return {
			"body-container": true,
			"is-visible": this.isSelected
		};
	}

	public get arrowClasses() {
		return {
			arrow: true,
			up: !this.isSelected,
			down: this.isSelected
		};
	}

	public setSelected(isSelected: boolean) {
		this.isSelected = isSelected;
	}

	public onClick() {
		this.$emit("onClick");
		if (this.isInCardList) {
			return (this.$parent as any).selectCard(this);
		}

		this.setSelected(!this.isSelected);
	}

	public mounted() {
		if (this.isInCardList) {
			(this.$parent as any).addCard(this);
		}
	}
}
