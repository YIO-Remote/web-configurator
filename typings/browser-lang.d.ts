declare module 'browser-lang' {
	interface IBrowserLangOptions {
		languages?: string[];
		fallback?: string;
	}

	function browserLang(options?: IBrowserLangOptions): string;

	export default browserLang;
}
