interface Intent {
	id: number;
	choice: string;
	prompt: string;
}
interface Tone {
	id: number;
	choice: string;
	prompt: string;
}
interface Style {
	id: number;
	choice: string;
	prompt: string;
}
interface Audience {
	id: number;
	choice: string;
	prompt: string;
}
interface Type {
	id: number;
	name: string;
	api: string;
}

interface Power {
	level: string;
}
interface Vocabulary {
	level: string;
}
interface Options {
	Intent: Intent[];
	Tone: Tone[];
	Power: Power[];
}
interface AdvancedOption {
	Style: Style[];
	Audience: Audience[];
	Vocabulary: Vocabulary[];
}
interface PageData {
	id: number;
	title: string;
	subheading: string;
	Option: Options;
	AdvancedOption: AdvancedOption;
	Type: Type[];
}

export interface OptionData {
	currData: PageData;
}
