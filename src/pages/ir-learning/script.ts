import Vue from "vue";
import { Component } from "vue-property-decorator";
import CardList from '../../components/card-list/index.vue';
import Card from '../../components/card/index.vue';

@Component({
    name: 'IRLearningPage',
    components: {
        CardList,
        Card
    }
})
export default class IRLearningPage extends Vue {
    public docks = [{
        name: 'Living Room'
    }, {
        name: 'Kitchen'
    }, {
        name: 'Test'
    }];
}