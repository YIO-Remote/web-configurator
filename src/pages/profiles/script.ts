import Vue from 'vue';
import { map, withLatestFrom } from 'rxjs/operators';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IKeyValuePair, IEntity } from '../../types';
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
			profiles: this.store.select('config', 'ui_config', 'profiles'),
			// profiles: this.store.select('config', 'ui_config', 'profiles').pipe(map((profiles) => {
			// 	return Object.keys(profiles).map((id) => ({
			// 		id,
			// 		name: profiles[id].name,
			// 		favorites: profiles[id].favorites,
			// 		pages: profiles[id].pages,
			// 	}));
			// })),
			pages: this.store.select('config', 'ui_config', 'pages')
				.pipe(withLatestFrom(this.store.select('config', 'ui_config', 'groups')))
				.pipe(map(([pages, groups]) => {
					return Object.keys(pages).reduce((array: any[], key: string) => {
						return [
							...array,
							...[{
								id: key,
								name: pages[key].name,
								groups
							}]
						];
					}, [] as any[]);
				})),
			groups: this.store.select('config', 'ui_config', 'groups')
				.pipe(withLatestFrom(this.store.select('config', 'entities')))
				.pipe(map(([groups, entities]) => {
					return Object.keys(groups).reduce((array: any[], key: string) => {
						return [
							...array,
							...[{
								id: key,
								name: groups[key].name,
								entities
							}]
						];
					}, [] as any[]);
				})),
			entities: this.store.select('config', 'entities')
		};
	}
})
export default class ProfilesPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
	public selectedIndex: number = -1;
	public profiles: any[];
	public entities: IKeyValuePair<IEntity[]>;
	public groups: any[];
	public pages: any[];
	public newProfileName: string = '';

	public get profileEntities() {
		if (this.selectedIndex === -1) {
			return [];
		}

		const selectedProfile = this.profiles[this.selectedIndex];
		const allEntities = Object.values(this.entities).flat();

		return allEntities.filter((entity) => selectedProfile.favorites.includes(entity.entity_id));
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

		this.$menu.show(ProfileOptions, {
			entities: this.entities,
			groups: this.groups,
			pages: this.pages
		});
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
