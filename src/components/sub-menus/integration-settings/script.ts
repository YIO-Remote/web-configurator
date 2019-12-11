import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'IntegrationSettings'
})
export default class IntegrationSettings extends Vue {
    @Prop({
        type: Object,
        required: true
    })
    public integration: any;
}