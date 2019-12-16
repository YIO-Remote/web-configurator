import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";

@Component({
	name: "CardList"
})
export default class CardList extends Vue {
	@Prop({
		type: Number,
		default: -1
	})
	public initialIndex: number;

	public cards: any[] = [];

	public addCard(card: any) {
		this.cards.push(card);

		if (this.initialIndex === (this.cards.length - 1)) {
			this.selectCard(card);
		}
	}

	public selectCard(cardToSelect: any) {
		this.cards.forEach((card, index) => {
			let isSelected = (cardToSelect === card);

			if (card.isSelected && isSelected) {
				isSelected = false;
				index = -1;
			}

			card.setSelected(isSelected);

			if (isSelected || index === -1) {
				this.$emit("onSelected", index);
			}
		});
	}
}
