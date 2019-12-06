import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IProfile } from '../../types';
import TabContainer from '../tabs/tab-container/index.vue';
import Tab from '../tabs/tab/index.vue';

@Component({
    name: 'ProfileOptions',
    components: {
        TabContainer,
        Tab
    }
})
export default class ProfileOptions extends Vue {
    @Prop({
        type: Object,
        // required: true
    })
    public profile: IProfile;
}