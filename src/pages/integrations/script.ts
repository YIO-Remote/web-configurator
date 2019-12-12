import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import YioTable from '../../components/table/index.vue';
import DeleteButton from '../../components/delete-icon-button/index.vue';
import IntegrationSettings from '../../components/sub-menus/integration-settings/index.vue';

@Component({
    name: 'IntegrationsPage',
    components: {
        YioTable,
        DeleteButton
    },
    subscriptions(this: IntegrationsPage) {
        return {
            configuredIntegrations: this.store.select('config', 'integrations').pipe(map((integrations) => {
                return Object.keys(integrations).reduce((array: any[], key: string) => {
                    return [
                        ...array,
                        ...[integrations[key]]
                    ];
                }, [] as any[]);
            }))
        };
    }
})
export default class IntegrationsPage extends Vue {
    @Inject(() => YioStore)
    public store: YioStore;

    public mounted() {
        this.$menu.show(IntegrationSettings, {
            integration: null
        });
    }

    public onItemSelected(item?: any) {
        this.$menu.show(IntegrationSettings, {
            integration: item
        });
    }

    public onItemDeleted(item: any) {
        console.log(item);
        alert('TODO: Remove Integration...');
    }

    public beforeDestroy() {
        this.$menu.hide();
    }
}