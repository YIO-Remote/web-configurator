import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import ActionButton from '../../action-button/index.vue';

@Component({
	name: 'IntegrationSettings',
	components: {
		ActionButton
	}
})
export default class IRButtonMapping extends Vue {
}
