import browserLang from "browser-lang";
import en_US from "./en_US";
import nl_NL from "./nl_NL";

export default {
	locale: browserLang({
		languages: ["en_US", "nl_NL"],
		fallback: "en_US",
	}),
	messages: {
		en_US,
		nl_NL,
	},
};
