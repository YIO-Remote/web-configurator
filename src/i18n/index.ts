import VueI18n from 'vue-i18n';
import browserLang from 'browser-lang';
import bg_BG from './bg_BG.json';
import ca_ES from './ca_ES.json';
import cs_CZ from './cs_CZ.json';
import da_DK from './da_DK.json';
import el_GR from './el_GR.json';
import en_US from './en_US.json';
import es_ES from './es_ES.json';
import et_EE from './et_EE.json';
import fi_FI from './fi_FI.json';
import fr_FR from './fr_FR.json';
import ga_IE from './ga_IE.json';
import hr_HR from './hr_HR.json';
import hu_HU from './hu_HU.json';
import is_IS from './is_IS.json';
import it_IT from './it_IT.json';
import lt_LT from './lt_LT.json';
import lv_LV from './lv_LV.json';
import mt_MT from './mt_MT.json';
import nl_NL from './nl_NL.json';
import no_NO from './no_NO.json';
import pl_PL from './pl_PL.json';
import pt_BR from './pt_BR.json';
import pt_PT from './pt_PT.json';
import ro_RO from './ro_RO.json';
import ru_BY from './ru_BY.json';
import ru_MD from './ru_MD.json';
import ru_RU from './ru_RU.json';
import ru_UA from './ru_UA.json';
import sk_SK from './sk_SK.json';
import sl_SL from './sl_SI.json';
import sv_SE from './sv_SE.json';
import zh_CN from './zh_CN.json';
import zh_TW from './zh_TW.json';

export class Localisation extends VueI18n {
	constructor() {
		super({
			locale: browserLang({
				languages: ['en_US', 'nl_NL'],
				fallback: 'en_US',
			}),
			fallbackLocale: 'en_US',
			messages: {
				bg_BG,
				ca_ES,
				cs_CZ,
				da_DK,
				el_GR,
				en_US,
				es_ES,
				et_EE,
				fi_FI,
				fr_FR,
				ga_IE,
				hr_HR,
				hu_HU,
				is_IS,
				it_IT,
				lt_LT,
				lv_LV,
				mt_MT,
				nl_NL,
				no_NO,
				pl_PL,
				pt_BR,
				pt_PT,
				ro_RO,
				ru_BY,
				ru_MD,
				ru_RU,
				ru_UA,
				sk_SK,
				sl_SL,
				sv_SE,
				zh_CN,
				zh_TW
			}
		});
	}
}
