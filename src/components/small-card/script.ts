import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import ActionIconButton from '../action-icon-button/index.vue';
import { ICardListComponent } from '../../types';

@Component({
	name: 'SmallCard',
	components: {
		ActionIconButton
	}
})
export default class SmallCard extends Vue {
	@Prop({
		type: String,
		required: true
	})
	public title: string;

	@Prop({
		type: Object,
		required: false,
		default: () => ({})
	})
	public data: object;

	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public iconType?: string;
	public isSelected: boolean = false;
	public $parent: ICardListComponent;

	public get cardList() {
		return this.$parent.$parent;
	}

	public get isInCardList() {
		return (typeof this.$parent.$parent.addCard === 'function');
	}

	public get hasRightIconContent() {
		return !!this.iconType;
	}

	public get hasBodyContent() {
		return this.$slots.body || this.$scopedSlots.body;
	}

	public get classes() {
		return {
			'card': true,
			'is-selected': this.isSelected
		};
	}

	public get bodyContainerClasses() {
		return {
			'body-container': true,
			'is-visible': this.hasBodyContent
		};
	}

	public setSelected(isSelected: boolean) {
		this.isSelected = isSelected;
	}

	public onClick() {
		this.$emit('onClick');

		if (this.isInCardList) {
			return this.cardList.selectCard(this);
		}

		this.setSelected(!this.isSelected);
	}

	public onIconClick() {
		this.$emit('onIconClick');
	}

	public mounted() {
		if (this.isInCardList) {
			this.cardList.addCard(this);
		}
	}
}
