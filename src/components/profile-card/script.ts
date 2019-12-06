import Vue from 'vue';
import { Component, Prop, Emit } from 'vue-property-decorator';
import { IProfile } from '../../types';

@Component({
    name: 'ProfileCard'
})
export default class ProfileCard extends Vue {
    @Prop({
        type: Object,
        required: true
    })
    public profile: IProfile;

    @Prop({
        type: Boolean,
        required: true
    })
    public isSelected: boolean;


    @Emit('onClick')
    public onClick() {
        return this.profile;
    }
}