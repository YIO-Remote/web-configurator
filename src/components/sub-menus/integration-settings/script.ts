import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import ActionButton from "../../action-button/index.vue";

@Component({
	name: "IntegrationSettings",
	components: {
		ActionButton
	}
})
export default class IntegrationSettings extends Vue {
	@Prop({
		type: Object,
		required: false
	})
	public integration: any;

	public get hasIntegrationSelected() {
		return !!this.integration;
	}

	public onAddNewIntegration() {
		alert("TODO: Add new integration steps...");
	}
}
