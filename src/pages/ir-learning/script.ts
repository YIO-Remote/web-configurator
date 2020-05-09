import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { SwiperOptions } from 'swiper';
import { Guid } from 'guid-typescript';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IDropDownItem, IDropDownComponent, IRemoteEntityAggregate, IRemoteFeature, IButtonConfig } from '../../types';
import Icon from '../../components/icon/index.vue';
import TextInput from '../../components/text-input/index.vue';
import ActionButton from '../../components/action-button/index.vue';
import ActionIconButton from '../../components/action-icon-button/index.vue';
import DropDown from '../../components/drop-down/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import CardList from '../../components/card-list/index.vue';
import SmallCard from '../../components/small-card/index.vue';
import IRButtonMapping from '../../components/sub-menus/ir-button-mapping/index.vue';
import ButtonPad from '../../components/remote-control-screens/button-pad/index.vue';
import { NUMBER_PAD_FEATURE, POWER_CONTROL_FEATURE, TUNER_FEATURE, VOLUME_CONTROL_FEATURE } from '../../buttons';

@Component({
	name: 'IRLearningPage',
	components: {
		Icon,
		TextInput,
		ActionButton,
		ActionIconButton,
		DropDown,
		RemoteControl,
		CardList,
		SmallCard,
		Draggable,
		ButtonPad
	}
})
export default class IRLearningPage extends Vue {
	public powerFeature = POWER_CONTROL_FEATURE;
	public numberPadFeature = NUMBER_PAD_FEATURE;
	public tunerFeature = TUNER_FEATURE;
	public volumeFeature = VOLUME_CONTROL_FEATURE;
	public featuresDragOptions = {
		disabled: false,
		sort: false,
		group: {
			name: 'features',
			pull: 'features',
			put: false
		}
	};

	public dropZoneOptions = {
		disabled: false,
		sort: false,
		group: {
			name: 'features',
			pull: false,
			put: 'features'
		}
	};

	public dropZoneList: IRemoteFeature[] = [];

	public features = [
		this.powerFeature,
		this.tunerFeature,
		this.volumeFeature,
		this.numberPadFeature
	];

	public docks: IDropDownItem[] = [{
		text: 'Living Room',
		value: 'dock.living-room'
	}, {
		text: 'Kitchen',
		value: 'dock.kitchen'
	}, {
		text: 'Test',
		value: 'dock.test'
	}];

	public remotes: IDropDownItem[] = [{
		text: 'TiVo',
		value: 'remote.tivo'
	}, {
		text: 'Sony AV',
		value: 'remote.sony-av'
	}, {
		text: 'Samsung TV',
		value: 'remote.samsung-tv'
	}, {
		text: 'Create New Remote...',
		value: 'remote.new-remote'
	}];

	public selectedDock: IDropDownItem = {} as IDropDownItem;
	public selectedRemote: IDropDownItem = {} as IDropDownItem;
	public showNewRemoteInput: boolean = false;
	public newRemote: IRemoteEntityAggregate = {} as IRemoteEntityAggregate;
	public swiperOptions: SwiperOptions = {
		preventClicks: false,
		preventClicksPropagation: false,
		loop: false,
		pagination: {
			el: '.swiper-pagination',
			clickable: true
		}
	};

	public onDockSelected(selected: IDropDownItem) {
		this.selectedDock = selected;

		const remoteDropDown = this.$refs['remote-drop-down'];

		if (remoteDropDown) {
			(remoteDropDown as IDropDownComponent).resetSelection();
		}

		this.$menu.hide();
	}

	public onRemoteSelected(selected: IDropDownItem) {
		this.selectedRemote = selected;

		if (selected.value === 'remote.new-remote') {
			this.showNewRemoteInput = true;
			this.$menu.hide();
		} else {
			this.showNewRemoteInput = false;
		}
	}

	public onFeatureDropped(event: IDragEndEvent) {
		const featureId = event.item.getAttribute('data-id') as string;
		const featureToAdd = this.features.find((feature) => feature.id === featureId) as IRemoteFeature;
		const indexToRemove = this.features.findIndex((feature) => feature.id === featureId);
		this.features.splice(indexToRemove, 1);
		this.dropZoneList.push(featureToAdd);
	}

	public onNewRemoteCreated() {
		const newRemoteOption = {
			text: this.newRemote.friendly_name,
			value: `${Guid.create()}`
		};

		this.remotes = [
			...this.remotes.splice(0, this.remotes.length - 1),
			newRemoteOption,
			...this.remotes
		];
		this.selectedRemote = newRemoteOption;
		this.showNewRemoteInput = false;
		this.newRemote = {} as IRemoteEntityAggregate;
		this.$nextTick().then(() => (this.$refs['remote-drop-down'] as IDropDownComponent).resetSelection(newRemoteOption));
	}

	public onButtonSelected(button: IButtonConfig) {
		this.$menu.show(IRButtonMapping, { button });
	}

	public onFeatureRemoved(config: IRemoteFeature) {
		this.$menu.hide();
		this.features.push(config);

		const indexToRemove = this.dropZoneList.findIndex((feature) => feature.id === config.id);
		this.dropZoneList.splice(indexToRemove, 1);
	}

	public get isDockSelected() {
		return !!this.selectedDock.value && this.selectedDock.value !== '-1';
	}

	public get isRemoteSelected() {
		return !!this.selectedRemote.value && this.selectedRemote.value !== '-1' && this.selectedRemote.value !== 'remote.new-remote';
	}

	// public get mediaControlFeatureSelected() {
	// 	return this.dropZoneList.includes('Media Controls');
	// }

	public get numberPadFeatureSelected() {
		return this.dropZoneList.includes(this.numberPadFeature);
	}

	public get powerFeatureSelected() {
		return this.dropZoneList.includes(this.powerFeature);
	}

	public get tunerFeatureSelected() {
		return this.dropZoneList.includes(this.tunerFeature);
	}

	public get volumeFeatureSelected() {
		return this.dropZoneList.includes(this.volumeFeature);
	}

	// public get sourceFeatureSelected() {
	// 	return this.dropZoneList.includes('Source Selection');
	// }

	public beforeDestroy() {
		this.$menu.hide();
	}
}
