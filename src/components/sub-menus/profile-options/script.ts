import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IEntity, IGroup, IPage, IKeyValuePair } from '../../../types';
import TabContainer from '../../tabs/tab-container/index.vue';
import Tab from '../../tabs/tab/index.vue';

@Component({
	name: 'ProfileOptions',
	components: {
		TabContainer,
		Tab
	}
})
export default class ProfileOptions extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public entities: IKeyValuePair<IEntity[]>;

	@Prop({
		type: Array,
		required: true
	})
	public groups: IGroup[];

	@Prop({
		type: Array,
		required: true
	})
	public pages: IPage[];
}
