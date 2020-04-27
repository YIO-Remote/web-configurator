declare module 'object-hash' {
	// tslint:disable-next-line:no-any
	function hash(obj: object | any[]): string;
	export = hash;
}
