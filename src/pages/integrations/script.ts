import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { map } from 'rxjs/operators';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import YioTable from '../../components/table/index.vue';
import IntegrationSettings from '../../components/sub-menus/integration-settings/index.vue';

@Component({
    name: 'IntegrationsPage',
    components: {
        YioTable
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

    public onItemSelected(item?: any) {
        if (!item) {
            this.$menu.hide();
            return;
        }

        this.$menu.show(IntegrationSettings, {
            integration: item
        });
    }

    public beforeDestroy() {
        this.$menu.hide();
    }
}