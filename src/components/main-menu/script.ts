import Vue from "vue";
import {Component} from "vue-property-decorator";

@Component({
	name: "MainMenu"
})
export default class MainMenu extends Vue {
	public get routes() {
		return (this as any).$router.options.routes.filter((route: any) => route.path !== "/");
	}
}
