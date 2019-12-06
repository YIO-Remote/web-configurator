import Vue from 'vue';
import {Component} from 'vue-property-decorator';

@Component({
    name: 'ContextMenu'
})
export default class ContextMenu extends Vue {
    public get routes() {
      return (this as any).$router.options.routes.filter((route: any) => route.path !== '/');
    }
}
