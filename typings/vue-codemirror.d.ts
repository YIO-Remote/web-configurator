declare module 'vue-codemirror' {
	import { PluginObject } from 'vue';

	import CodeMirror from 'codemirror';

	export interface IVueCodeMirror extends HTMLElement {
		codemirror: CodeMirror.Editor;
	}

	const VueCodeMirror: PluginObject<any>;

	export default VueCodeMirror;
}
