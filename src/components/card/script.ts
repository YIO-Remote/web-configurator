import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'Card'
})
export default class Card extends Vue {
    @Prop({
        type: Boolean,
        required: true
    })
    public isSelected: boolean;
}