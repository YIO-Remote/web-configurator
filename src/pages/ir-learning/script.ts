import Vue from "vue";
import { Component } from "vue-property-decorator";
import Card from '../../components/card/index.vue';

@Component({
    name: 'IRLearningPage',
    components: {
        Card
    }
})
export default class IRLearningPage extends Vue {
    public docks = [{
        name: 'Living Room'
    }, {
        name: 'Kitchen'
    }, {
        name: 'Test'
    }];

    public selectedCard: any;

    public onSelected(card: Card) {
        if (this.selectedCard === card) {
            this.selectedCard = void 0;
            return;
        }

        this.selectedCard && this.selectedCard.setSelected(false);
        this.selectedCard = card;
    }
}