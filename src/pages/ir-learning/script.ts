import Vue from "vue";
import { Component } from "vue-property-decorator";
import CardList from "../../components/card-list/index.vue";
import Card from "../../components/card/index.vue";
import ActionButton from "../../components/action-button/index.vue";

@Component({
	name: "IRLearningPage",
	components: {
		CardList,
		Card,
		ActionButton
	}
})
export default class IRLearningPage extends Vue {
	public docks = [{
		name: "Living Room"
	}, {
		name: "Kitchen"
	}, {
		name: "Test"
	}];

	public showNextButton: boolean = false;

	public onDockSelected(index: number) {
		this.showNextButton =  (index > -1);
	}

	public onNext() {
		alert("TODO: Build a proper wizard component");
	}
}
