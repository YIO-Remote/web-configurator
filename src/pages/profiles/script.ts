import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfile } from '../../types';
import ProfileCard from '../../components/profile-card/index.vue';
import ProfileOptions from '../../components/profile-options/index.vue';

@Component({
    name: 'ProfilesPage',
    components: {
        ProfileCard
    },
    subscriptions(this: ProfilesPage) {
        return {
            profiles: this.store.select('config', 'ui_config', 'profiles')
        };
    }
})
export default class ProfilesPage extends Vue {
    @Inject(() => YioStore)
    public store: YioStore;

    public selectedProfile: IProfile = {} as IProfile;

    public onProfileSelected(profile: IProfile) {
        if (this.selectedProfile === profile) {
            this.selectedProfile = {} as IProfile;
            this.$menu.hide();
            return;
        }

        this.$menu.show(ProfileOptions, { profile });
        this.selectedProfile = profile;
    }

    public beforeDestroy() {
        this.$menu.hide();
    }
}