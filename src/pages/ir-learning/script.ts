import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { SwiperOptions } from 'swiper';
import { Guid } from 'guid-typescript';
import Draggable, { IDragEndEvent } from 'vuedraggable';
import { IDropDownItem, IDropDownComponent, IRemoteEntityAggregate } from '../../types';
import Icon from '../../components/icon/index.vue';
import TextInput from '../../components/text-input/index.vue';
import ActionButton from '../../components/action-button/index.vue';
import ActionIconButton from '../../components/action-icon-button/index.vue';
import DropDown from '../../components/drop-down/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import CardList from '../../components/card-list/index.vue';
import SmallCard from '../../components/small-card/index.vue';
import IRButtonMapping from '../../components/sub-menus/ir-button-mapping/index.vue';

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
		Draggable
	}
})
export default class IRLearningPage extends Vue {
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

	public dropZoneList: string[] = [];

	public features = [
		'Power Control',
		'Navigation',
		'Tuner',
		'Volume',
		'Media Controls',
		'Number Pad',
		'Source Selection'
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
			this.$menu.show(IRButtonMapping, {});
		}
	}

	public onFeatureDropped(event: IDragEndEvent) {
		const feature = event.item.getAttribute('data-id') as string;
		const indexToRemove = this.features.findIndex((f) => f === feature);
		this.features.splice(indexToRemove, 1);
		this.dropZoneList.push(feature);
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

	public get isDockSelected() {
		return !!this.selectedDock.value && this.selectedDock.value !== '-1';
	}

	public get isRemoteSelected() {
		return !!this.selectedRemote.value && this.selectedRemote.value !== '-1' && this.selectedRemote.value !== 'remote.new-remote';
	}

	public get mediaControlFeatureSelected() {
		return this.dropZoneList.includes('Media Controls');
	}

	public get numberPadFeatureSelected() {
		return this.dropZoneList.includes('Number Pad');
	}

	public get powerFeatureSelected() {
		return this.dropZoneList.includes('Power Control');
	}

	public get sourceFeatureSelected() {
		return this.dropZoneList.includes('Source Selection');
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
