import { IConfigState } from '../../types';

const initialState: IConfigState = {
	entities: {},
	integrations: {},
	settings: {
		autobrightness: false,
		bluetootharea: false,
		language: 'en-US',
		paired_dock: '',
		proximity: 0,
		shutdowntime: 0,
		softwareupdate: {
			appUpdateScript: '',
			autoUpdate: false,
			channel: '',
			checkInterval: 0,
			downloadDir: '',
			systemUpdateScript: '',
			updateUrl: '',
			updateUrlAppPath: ''
		},
		logging: {
			console: false,
			level: '',
			path: '',
			purgeHours: 0,
			queueSize: 0,
			showSource: 0
		},
		wifitime: 0
	},
	ui_config: {
		darkmode: false,
		groups: {},
		pages: {},
		profiles: {},
		selected_profile: '0'
	}
};

export default initialState;
