import VueI18n from 'vue-i18n';
import browserLang from 'browser-lang';
import en_US from './en_US.json';
import nl_NL from './nl_NL.json';

export class Localisation extends VueI18n {
	constructor() {
		super({
			locale: browserLang({
				languages: ['en_US', 'nl_NL'],
				fallback: 'en_US',
			}),
			fallbackLocale: 'en_US',
			messages: {
				en_US,
		nl_NL,
			}
		});
	}
}
