import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { Inject } from '../../utilities/dependency-injection';
import { YioStore } from '../../store';
import { IEntity, IKeyValuePair } from '../../types';
import YioTable from '../../components/table/index.vue';
import ActionIconButton from '../../components/action-icon-button/index.vue';
import AvailableEntities from '../../components/sub-menus/available-entities/index.vue';

// tslint:disable:no-any
@Component({
	name: 'EntitiesPage',
	components: {
		YioTable,
		ActionIconButton
	},
	subscriptions(this: EntitiesPage) {
		return {
			configuredEntities: this.store.entities.configured,
			availableByIntegrations: this.store.entities.availableByIntegrations
		};
	}
})
export default class EntitiesPage extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
	public configuredEntities: IEntity[] = [];
	public availableByIntegrations: IKeyValuePair<IEntity[]> = {};

	public onItemDeleted(item: IEntity) {
		alert(`TODO: Remove Entity --> ${item.friendly_name}`);
	}

	public mounted() {
		this.$menu.show(AvailableEntities, {
			integrations: this.availableByIntegrations
		});

		this.$subscribeTo(this.store.entities.availableByIntegrations, (availableByIntegrations) => {
			this.$menu.updateProps({
				integrations: availableByIntegrations
			});
		});
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
