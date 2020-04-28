import Vue from 'vue';
import { Component, Prop, Watch } from 'vue-property-decorator';

@Component({
	name: 'TextInput'
})
export default class TextInput extends Vue {
	@Prop({
		type: String,
		required: true,
		default: ''
	})
	public readonly value: string;

	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public readonly watermark: string;

	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public readonly label: string;

	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public readonly mode: string;

	@Prop({
		type: Boolean,
		required: false,
		default: false
	})
	public readonly disabled: string;
	public editValue: string = this.value;
	public isEditing: boolean = false;
	public hasChanges: boolean = false;

	@Watch('value', {
		immediate: true
	})
	public onInputValueChanged(value: string) {
		this.editValue = value;
	}

	public get isInEditMode() {
		if (this.mode === 'edit' || this.mode === 'input') {
			return true;
		}

		return this.isEditing;
	}

	public get isInInputMode() {
		return (this.mode === 'input');
	}

	public get hasLabel() {
		return !!this.label;
	}

	public onFocus($event: InputEvent) {
		if ($event.target) {
			($event.target as HTMLInputElement).select();
			this.onEdit();
		}
	}

	public onEdit() {
		this.isEditing = true;
		this.$nextTick().then(() => (this.$refs.input as HTMLInputElement).focus());
	}

	public onChange() {
		this.hasChanges = true;
		this.$emit('input', this.editValue);
	}

	public onSave() {
		this.isEditing = false;
		this.hasChanges = false;
		this.$emit('onSave', this.editValue);

		if (this.mode === 'edit') {
			this.editValue = '';
		}
	}

	public mounted() {
		document.addEventListener('click', (event) => {
			if (event.target === null) {
				this.isEditing = false;
			}

			if (!this.$el.contains(event.target as Node)) {
				this.isEditing = false;
			}

			if (!this.isEditing && this.hasChanges) {
				this.editValue = this.value;
				this.onChange();
			}
		});
	}
}
