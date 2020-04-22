import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IPageAggregate } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';

@Component({
	name: 'EditPages',
	components: {
		ActionIconButton
	}
})
export default class EditPage extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public page: IPageAggregate;
}
