import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { IEntity, IKeyValuePair } from '../../../types';
import ActionIconButton from '../../action-icon-button/index.vue';

@Component({
	name: 'AvailableEntities',
	components: {
		ActionIconButton
	}
})
export default class AvailableEntities extends Vue {
	@Prop({
		type: Object,
		required: true
	})
	public integrations: IKeyValuePair<IEntity[]>;

	public addEntity(entity: IEntity) {
		alert(`Add entity ---> ${entity.friendly_name}`);
	}
}
