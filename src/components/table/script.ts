import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
    name: 'YioTable'
})
export default class YioTable extends Vue {
    @Prop({
        type: Array,
        required: true
    })
    public items: any[];

    @Prop({
        type: String,
        default: '100%'
    })
    public maxHeight: string;

    public selectedItem: any = null;
    
    public rowSelected(item: any) {
        if (this.selectedItem === item) {
            this.selectedItem = null;
        } else {
            this.selectedItem = item;
        }
        
        this.$emit('onItemSelected', this.selectedItem);
    }
}