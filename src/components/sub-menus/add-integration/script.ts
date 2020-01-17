import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';
import { Inject } from '../../../utilities/dependency-injection';
import { YioStore } from '../../../store';

@Component({
	name: 'AddIntegration',
	components: {
		ActionButton
	}
})
export default class AddIntegration extends Vue {
	@Inject(() => YioStore)
	public store: YioStore;

	public onAddNewIntegration() {
		this.store.dispatch(this.store.actions.addIntegration({
			data: [{
				friendly_name: 'Nest',
				id: 'nest.test',
				data: {
					ip: '192.168.10.111',
					token: 'some-kinda-token'
				}
			}]
		}, 'nest'));
		// alert('TODO: Add new integration steps...');
	}
}
