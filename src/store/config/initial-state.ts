import { IConfig } from '../../types';

const initialState: IConfig = {
    entities: {},
    integrations: {},
    settings: {
        autobrightness: false,
        bluetootharea: false,
        language: 'en-US',
        paired_dock: '',
        proximity: 0,
        shutdowntime: 0,
        softwareupdate: false,
        wifitime: 0
    },
    ui_config: {
        darkmode: false,
        groups: {},
        pages: {},
        profiles: {},
        selected_profile: 0
    }
};

export default initialState;