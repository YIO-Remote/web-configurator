import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';
import { timer } from 'rxjs';
import { map } from 'rxjs/operators';
import { IRemoteEntityAggregate } from '../../types';
import Icon from '../icon/index.vue';

function padZero(num: number): string {
	return (num < 10) ? `0${num}` : `${num}`;
}

@Component({
	name: 'RemoteControl',
	components: {
		Icon
	},
	subscriptions(this: RemoteControl) {
		return {
			time: timer(0, 1000).pipe(map(() => {
				const now = new Date();
				return `${padZero(now.getHours())}:${padZero(now.getMinutes())}`;
			}))
		};
	}
})
export default class RemoteControl extends Vue {
	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public readonly message: string;

	@Prop({
		type: Boolean,
		required: false,
		default: true
	})
	public readonly scrollable: boolean;

	@Prop({
		type: Boolean,
		required: false,
		default: true
	})
	public readonly showControls: boolean;

	@Prop({
		type: Object,
		required: false
	})
	public readonly remote: IRemoteEntityAggregate;

	// "remote": [
	// 	{
	// 		"area": "Living room",
	// 		"commands": [
	// 			{
	// 				"button_map": "POWER_TOGGLE",
	// 				"code": "38000, 9046, 4482,  570, 556,  566, 556,  566, 1676,  568, 580,  542, 554,  566, 556,  568, 556,  566, 556,  566, 1676,  570, 1676,  568, 1678,  568, 1676,  570, 554,  568, 556,  566, 556,  566, 554,  568, 1676,  568, 556,  566, 1676,  568, 1676,  568, 554,  568, 1676,  568, 580,  542, 1676,  568, 554,  568, 1676,  568, 556,  566, 556,  566, 1676,  568, 556,  566, 1676,  568, 556,  566, 43566,  9046, 2238,  570, 17044,  286"
	// 			}
	// 		],
	// 		"entity_id": "remote.living_room",
	// 		"friendly_name": "Living room TV",
	// 		"integration": "ir",
	// 		"supported_features": [
	// 			"POWER_TOGGLE",
	// 			"CHANNEL_UP"
	// 		]
	// 	}
	// ]
}
