import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IProfile, IEntity } from '../../types';
import Card from '../../components/card/index.vue';
import ProfileOptions from '../../components/profile-options/index.vue';
import { map, withLatestFrom, combineLatest } from 'rxjs/operators';

@Component({
    name: 'ProfilesPage',
    components: {
        Card
    },
    subscriptions(this: ProfilesPage) {
        return {
            profiles: this.store.select('config', 'ui_config', 'profiles'),
            groups: this.store.select('config', 'ui_config', 'groups')
                .pipe(combineLatest(this.store.select('config', 'entities')))
                .pipe(map(([groups, entities]) => {
                    console.log(groups, entities)
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

    public selectedCard: any;
    public selectedCardIndex: number = 0;

    public profiles: { [key: string]: IProfile; };
    public entities: any[];
    public groups: any[];

    public onProfileSelected(card: Card) {
        if (this.selectedCard === card) {
            this.selectedCard = void 0;
            this.$menu.hide();
            return;
        }

        this.selectedCard && this.selectedCard.setSelected(false);
        this.selectedCardIndex = this.$children.findIndex((child) => child === card);
        this.$menu.show(ProfileOptions, {
            entities: this.entities,
            groups: this.groups,
        });
        this.selectedCard = card;
    }

    public buttonPress(side: string, direction: string) {
        alert(`You pressed the ${side} hand side button, ${direction}`)
    }

    public beforeDestroy() {
        this.$menu.hide();
    }

    public get foo() {
        return this.entities.filter((entity) => this.profiles[this.selectedCardIndex].favorites.includes(entity.id));
    }
}