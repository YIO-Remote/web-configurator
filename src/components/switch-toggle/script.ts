import Vue from 'vue';
import {Component, Model} from 'vue-property-decorator';

@Component({
    name: 'SwitchToggle'
})
export default class SwitchToggle extends Vue {
    @Model('onToggle', {
        type: Boolean
    })
    public readonly checked!: boolean;
}