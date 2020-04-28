import { parse, stringify } from 'query-string';

const queryString = parse(location.search);

if (Object.keys(queryString).length > 0) {
	window.history.pushState({}, document.title, '/');
}

export function getQueryString() {
	return queryString;
}

export function stringifyFormParams(params: object) {
	return stringify(params);
}
