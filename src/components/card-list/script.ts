import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { ICardComponent } from '../../types';

@Component({
	name: 'CardList'
})
export default class CardList extends Vue {
	@Prop({
		type: Number,
		default: -1
	})
	public initialIndex: number;

	public cards: ICardComponent[] = [];

	public addCard(card: ICardComponent) {
		this.cards.push(card);

		if (this.initialIndex === (this.cards.length - 1)) {
			this.selectCard(card);
		}
	}

	public selectCard(cardToSelect: ICardComponent) {
		this.cards.forEach((card, index) => {
			let isSelected = (cardToSelect === card);

			if (card.isSelected && isSelected) {
				isSelected = false;
				index = -1;
			}

			card.setSelected(isSelected);

			if (isSelected || index === -1) {
				this.$emit('onSelected', index);
			}
		});
	}

	public deselect() {
		this.cards.forEach((card) => {
			card.setSelected(false);
		});
	}
}
