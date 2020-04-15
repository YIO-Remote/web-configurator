import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfileAggregate } from '../../types';
import CardList from '../../components/card-list/index.vue';
import Card from '../../components/card/index.vue';
import ProfileOptions from '../../components/sub-menus/profile-options/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import ActionButton from '../../components/action-button/index.vue';

// tslint:disable:no-any
@Component({
	name: 'ProfilesPage',
	components: {
		CardList,
		Card,
		RemoteControl,
		ActionButton
	},
	subscriptions(this: ProfilesPage) {
		return {
			profiles: this.store.profiles.profiles$
		};
	}
})
export default class ProfilesPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
	public selectedIndex: number = -1;
	public profiles: IProfileAggregate[];
	public newProfileName: string = '';

	public get selectedProfile() {
		if (this.selectedIndex === -1) {
			return void 0;
		}

		return this.profiles[this.selectedIndex];
	}

	public get selectedProfileFavorites() {
		return this.selectedProfile ? this.selectedProfile.favorites : [];
	}

	public getBadgeClasses(isSelected: boolean) {
		return {
			badge: true,
			selected: isSelected
		};
	}

	public onSelected(index: number) {
		if (index === -1) {
			this.selectedIndex = -1;
			this.$menu.hide();
			return;
		}

		this.selectedIndex = index;

		this.$menu.show(ProfileOptions, {});
	}

	public buttonPress(side: string, direction: string) {
		alert(`You pressed the ${side} hand side button, ${direction}`);
	}

	public createNewProfile() {
		alert(1);
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
