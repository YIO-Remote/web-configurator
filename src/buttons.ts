import { IRemoteFeature } from './types';

// 'Power Control', - DONE
// 'Navigation',
// 'Tuner', - DONE
// 'Volume',
// 'Media Controls',
// 'Number Pad', - DONE
// 'Source Selection'

export const VOLUME_CONTROL_FEATURE: IRemoteFeature = {
	id: 'volume',
	name: 'Volume Control',
	buttonGroups: [
		[{
			enabled: true,
			feature: 'F_VOLUME_UP',
			button: 'C_VOLUME_UP',
			text: '',
			icon: 'up-arrow-bold',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_VOLUME_DOWN',
			button: 'C_VOLUME_DOWN',
			text: '',
			icon: 'down-arrow-bold',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_MUTE_TOGGLE',
			button: 'C_MUTE_TOGGLE',
			text: '',
			icon: 'close',
			colour: '',
			size: 'large',
			command: ''
		}]
	]
};

export const TUNER_FEATURE: IRemoteFeature = {
	id: 'tuner',
	name: 'Tuner',
	buttonGroups: [
		[{
			enabled: true,
			feature: 'F_CHANNEL_UP',
			button: 'C_CHANNEL_UP',
			text: '',
			icon: 'up-arrow-bold',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_CHANNEL_DOWN',
			button: 'C_CHANNEL_DOWN',
			text: '',
			icon: 'down-arrow-bold',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_CHANNEL_SEARCH',
			button: 'C_CHANNEL_SEARCH',
			text: '',
			icon: 'search',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_FAVORITE',
			button: 'C_FAVORITE',
			text: '',
			icon: 'fav-add',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_GUIDE',
			button: 'C_GUIDE',
			text: '',
			icon: 'playlist',
			colour: '',
			size: 'large',
			command: ''
		}]
	]
};

export const POWER_CONTROL_FEATURE: IRemoteFeature = {
	id: 'power.source',
	name: 'Power Control',
	buttonGroups: [
		[{
			enabled: true,
			feature: 'F_POWER_ON',
			button: 'C_POWER_ON',
			text: '',
			icon: 'power-on',
			colour: 'green',
			size: 'large',
			command: '0000 0068 0000 000D 0060 0018 0030 0018 0018 0018 0018 0018 0030 0018 0018 0018 0018 0018 0018 0018 0030 0018 0018 0018 0030 0018 0030 0018 0018 03F0'
		}, {
			enabled: true,
			feature: 'F_POWER_OFF',
			button: 'C_POWER_OFF',
			text: '',
			icon: 'power-on',
			colour: 'red',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_POWER_TOGGLE',
			button: 'C_POWER_TOGGLE',
			text: '',
			icon: 'power-on',
			colour: '',
			size: 'large',
			command: ''
		}]
	]
};

export const NUMBER_PAD_FEATURE: IRemoteFeature = {
	id: 'number.pad',
	name: 'Number Pad',
	buttonGroups: [
		[{
			enabled: true,
			feature: 'F_DIGIT_1',
			button: 'C_DIGIT_1',
			text: '1',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_2',
			button: 'C_DIGIT_2',
			text: '2',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_3',
			button: 'C_DIGIT_3',
			text: '3',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_4',
			button: 'C_DIGIT_4',
			text: '4',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_5',
			button: 'C_DIGIT_5',
			text: '5',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_6',
			button: 'C_DIGIT_6',
			text: '6',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_7',
			button: 'C_DIGIT_7',
			text: '7',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_8',
			button: 'C_DIGIT_8',
			text: '8',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_9',
			button: 'C_DIGIT_9',
			text: '9',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}, {
			enabled: true,
			feature: 'F_DIGIT_0',
			button: 'C_DIGIT_0',
			text: '0',
			icon: '',
			colour: '',
			size: 'large',
			command: ''
		}],
		[{
			enabled: true,
			feature: 'F_FUNCTION_RED',
			button: 'C_FUNCTION_RED',
			text: '',
			icon: '',
			colour: 'red',
			size: 'small',
			command: ''
		}, {
			enabled: true,
			feature: 'F_FUNCTION_GREEN',
			button: 'C_FUNCTION_GREEN',
			text: '',
			icon: '',
			colour: 'green',
			size: 'small',
			command: ''
		}, {
			enabled: true,
			feature: 'F_FUNCTION_YELLOW',
			button: 'C_FUNCTION_YELLOW',
			text: '',
			icon: '',
			colour: 'yellow',
			size: 'small',
			command: ''
		}, {
			enabled: true,
			feature: 'F_FUNCTION_BLUE',
			button: 'C_FUNCTION_BLUE',
			text: '',
			icon: '',
			colour: 'blue',
			size: 'small',
			command: ''
		}, {
			enabled: true,
			feature: 'F_FUNCTION_ORANGE',
			button: 'C_FUNCTION_ORANGE',
			text: '',
			icon: '',
			colour: 'orange',
			size: 'small',
			command: ''
		}]
	]
};
