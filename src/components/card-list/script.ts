import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { ICardComponent } from '../../types';

@Component({
	name: 'CardList',
	components: {
		Draggable
	}
})
export default class CardList extends Vue {
	@Prop({
		type: Number,
		default: -1,
	})
	public initialIndex: number;

	@Prop({
		type: Object,
		required: false,
		default: () => ({
			disabled: true,
			sort: false
		})
	})
	public dragOptions: object;

	@Prop({
		type: Array,
		required: false,
		default: () => []
	})
	public dragItems: [];

	@Prop({
		type: Boolean,
		required: false,
		default: false
	})
	public disableSelect: boolean;

	public cards: ICardComponent[] = [];

	public addCard(card: ICardComponent) {
		this.cards.push(card);

		if (this.initialIndex === (this.cards.length - 1)) {
			this.selectCard(card);
		}
	}

	public removeCard(cardToRemove: ICardComponent) {
		const indexToRemove = this.cards.findIndex((card) => card === cardToRemove);
		this.selectCard(cardToRemove);
		this.cards.splice(indexToRemove, 1);
	}

	public selectCard(cardToSelect: ICardComponent) {
		if (this.disableSelect) {
			return;
		}

		this.cards.forEach((card, index) => {
			let isSelected = (cardToSelect === card);

			if (card.isSelected && isSelected) {
				isSelected = false;
				index = -1;
			}

			card.setSelected(isSelected);

			if (isSelected || index === -1) {
				this.$emit('onSelected', (index > -1) ? card.data : {}, index);
			}
		});
	}

	public deselect() {
		this.cards.forEach((card) => {
			card.setSelected(false);
		});
	}

	public onSortUpdate(event: IDragEndEvent) {
		this.$emit('onSortUpdate', event);
	}
}
