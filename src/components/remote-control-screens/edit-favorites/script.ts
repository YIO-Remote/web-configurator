import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IEntityAggregate } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';

@Component({
	name: 'EditFavorites',
	components: {
		ActionIconButton
	}
})
export default class EditFavorites extends Vue {
	@Prop({
		type: Array,
		required: true
	})
	public favorites: IEntityAggregate[];
}
