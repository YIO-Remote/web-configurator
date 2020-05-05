import Vue from 'vue';
import { Component } from 'vue-property-decorator';
import { IDropDownItem, IDropDownComponent } from '../../types';
import TextInput from '../../components/text-input/index.vue';
import ActionButton from '../../components/action-button/index.vue';
import DropDown from '../../components/drop-down/index.vue';
import RemoteControl from '../../components/remote-control/index.vue';
import IRButtonMapping from '../../components/sub-menus/ir-button-mapping/index.vue';
import { Guid } from 'guid-typescript';

@Component({
	name: 'IRLearningPage',
	components: {
		TextInput,
		ActionButton,
		DropDown,
		RemoteControl
	}
})
export default class IRLearningPage extends Vue {
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
	public newRemoteName: string = '';

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

	public onNewRemoteCreated() {
		const newRemote = {
			text: this.newRemoteName,
			value: `${Guid.create()}`
		};

		this.remotes = [
			...this.remotes.splice(0, this.remotes.length - 1),
			newRemote,
			...this.remotes
		];
		this.selectedRemote = newRemote;
		this.showNewRemoteInput = false;
		this.newRemoteName = '';
		this.$nextTick().then(() => (this.$refs['remote-drop-down'] as IDropDownComponent).resetSelection(newRemote));
	}

	public get isDockSelected() {
		return !!this.selectedDock.value && this.selectedDock.value !== '-1';
	}

	public get isRemoteSelected() {
		return !!this.selectedRemote.value && this.selectedRemote.value !== '-1' && this.selectedRemote.value !== 'remote.new-remote';
	}

	public beforeDestroy() {
		this.$menu.hide();
	}
}
