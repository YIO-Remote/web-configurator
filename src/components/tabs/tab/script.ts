import Vue from 'vue';
import {Component, Prop} from 'vue-property-decorator';

@Component({
    name: 'Tab'
})
export default class Tab extends Vue {
    @Prop({
        type: String,
        required: true
    })
    public name: string;

    public isActive: boolean = false;

    public setIsActive(isActive: boolean) {
        this.isActive = isActive;
    }
}