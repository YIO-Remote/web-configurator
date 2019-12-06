import Vue, { VueConstructor } from 'vue'

declare module 'vue/types/vue' {
  interface Vue {
    $menu: ContextMenu;
  }
}