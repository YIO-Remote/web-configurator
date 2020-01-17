import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';

@Component({
	name: 'AddIntegration',
	components: {
		ActionButton
	}
})
export default class AddIntegration extends Vue {
	public onAddNewIntegration() {
		alert('TODO: Add new integration steps...');
	}
}
