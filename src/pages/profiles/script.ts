import Vue from 'vue';
import { map, withLatestFrom } from 'rxjs/operators';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import CardList from '../../components/card-list/index.vue';
import Card from '../../components/card/index.vue';
import ProfileOptions from '../../components/profile-options/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';

@Component({
    name: 'ProfilesPage',
    components: {
        CardList,
        Card,
        RemoteControl
    },
    subscriptions(this: ProfilesPage) {
        return {
            profiles: this.store.select('config', 'ui_config', 'profiles').pipe(map((profiles) => {
                return Object.keys(profiles).map((id) => ({
                    id,
                    name: profiles[id].name,
                    favorites: profiles[id].favorites,
                    pages: profiles[id].pages,
                }));
            })),
            pages: this.store.select('config', 'ui_config', 'pages')
                .pipe(withLatestFrom(this.store.select('config', 'ui_config', 'groups')))
                .pipe(map(([pages, groups]) => {
                    return Object.keys(pages).reduce((array: any[], key: string) => {
                        return [
                            ...array,
                            ...[{
                                id: key,
                                name: pages[key].name,
                                groups: groups
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
                                entities: entities
                            }]
                        ];
                    }, [] as any[]);
                })),
            entities: this.store.select('config', 'entities').pipe(map((entities) => {
                return Object.keys(entities).reduce((array: any[], key: string) => {
                    return [
                        ...array,
                        ...entities[key].map((entity) => ({
                            type: key,
                            id: entity.entity_id,
                            name: entity.friendly_name,
                            integration: entity.integration,
                            features: entity.supported_features,
                        }))
                    ];
                }, [] as any[]);
            }))
        };
    }
})
export default class ProfilesPage extends Vue {
    @Inject(() => YioStore)
    public store: YioStore;

    public getBadgeClasses(isSelected: boolean) {
        return {
            'badge': true,
            'selected': isSelected
        };
    }

    public selectedIndex: number = 0;
    public profiles: any[];
    public entities: any[];
    public groups: any[];
    public pages: any[];

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

    public get profileEntities() {
        if (this.selectedIndex === -1) {
            return [];
        }

        return this.entities.filter((entity) => this.profiles[this.selectedIndex].favorites.includes(entity.id));
    }

    public buttonPress(side: string, direction: string) {
        alert(`You pressed the ${side} hand side button, ${direction}`)
    }

    public beforeDestroy() {
        this.$menu.hide();
    }
}
