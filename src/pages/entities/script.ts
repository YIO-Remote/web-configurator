import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import YioTable from '../../components/table/index.vue';
import DeleteButton from '../../components/delete-icon-button/index.vue';
import AvailableEntities from '../../components/sub-menus/available-entities/index.vue';

@Component({
    name: 'EntitiesPage',
    components: {
        YioTable,
        DeleteButton
    },
    subscriptions(this: EntitiesPage) {
        return {
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
export default class EntitiesPage extends Vue {
    @Inject(() => YioStore)
    public store: YioStore;
    public entities: any[];

    public onItemSelected(item?: any) {
        if (!item) {
            this.$menu.hide();
            return;
        }

        this.$menu.show(AvailableEntities, {
            entities: this.entities
        });
    }

    public onItemDeleted(item: any) {
        console.log(item);
        alert('TODO: Remove Entity...');
    }

    public beforeDestroy() {
        this.$menu.hide();
    }
}