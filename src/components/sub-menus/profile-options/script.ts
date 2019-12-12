import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IEntity } from '../../../types';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';

@Component({
    name: 'ProfileOptions',
    components: {
        TabContainer,
        Tab
    }
})
export default class ProfileOptions extends Vue {
    @Prop({
        type: Array,
        required: true
    })
    public entities: IEntity[];

    @Prop({
        type: Array,
        required: true
    })
    public groups: any[];

    @Prop({
        type: Array,
        required: true
    })
    public pages: any[];
}