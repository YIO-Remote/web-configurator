import Vue from 'vue';
import { Component, Prop } from 'vue-property-decorator';

@Component({
	name: 'TextInput'
})
export default class TextInput extends Vue {
	@Prop({
		type: String,
		required: true
	})
	public readonly value: string;

	@Prop({
		type: String,
		required: false,
		default: ''
	})
	public readonly watermark: string;

	@Prop({
		type: Boolean,
		required: false,
		default: false
	})
	public readonly editMode: boolean;
	public editValue: string = this.value;
	public isEditing: boolean = false;

	public get isInEditMode() {
		if (this.editMode) {
			return true;
		}

		return this.isEditing;
	}

	public onEdit() {
		this.isEditing = true;
	}

	public onValueChanged(value: string) {
		this.editValue = value;
	}

	public onSave() {
		this.isEditing = false;
		this.$emit('onSave', this.editValue);
	}

	public mounted() {
		document.addEventListener('click', (event) => {
			if (event.target === null) {
				this.isEditing = false;
			}

			if (!this.$el.contains(event.target as Node)) {
				this.isEditing = false;
			}
		});
	}
}
