import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';

@Component({
	name: 'ProfileOptions',
	components: {
		TabContainer,
		Tab
	},
	subscriptions(this: ProfileOptions) {
		return {
			entities: this.store.select('entities', 'loaded'),
			groups: this.store.select('groups', 'all'),
			pages: this.store.select('pages', 'all')
		};
	}
})
export default class ProfileOptions extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;
}
