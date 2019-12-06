import Vue from 'vue';
import {Component} from 'vue-property-decorator';
import { YioStore } from '../store';
import { Inject } from '../utilities/dependency-injection';
import { ServerConnection } from '../utilities/server';
import MainMenu from '../components/main-menu/index.vue';

@Component({
    name: 'ProfilesPage',
    components: {
        MainMenu
    }
})
export default class ProfilesPage extends Vue {
    @Inject(() => YioStore)
    private store: YioStore;

    @Inject(() => ServerConnection)
    private connection: ServerConnection;

    private previousHeight: string | null;

    public mounted() {
        this.connection.connect();
        // this.store.select('config').subscribe((e) => console.log(e))
    }

    public beforeLeave(element: HTMLElement) {
        this.previousHeight = getComputedStyle(element).height;
    }
    
    public enter(element: HTMLElement) {
        const { height } = getComputedStyle(element);
  
        element.style.height = this.previousHeight as string;
  
        setTimeout(() => {
          element.style.height = height;
        });
    }

    public afterEnter(element: HTMLElement) {
        element.style.height = 'auto';
    }
}