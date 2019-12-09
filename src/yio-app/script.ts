import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import MainMenu from '../components/main-menu/index.vue';
import DisconnectedOverlay from '../components/disconnected-overlay/index.vue';

@Component({
    name: 'ProfilesPage',
    components: {
        MainMenu,
        DisconnectedOverlay
    }
})
export default class ProfilesPage extends Vue {
    private previousHeight: string | null;

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
        element.style.height = '100%';
    }
}