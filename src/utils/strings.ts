import chalk, { Chalk } from 'chalk';

export const HIDE_CURSOR = '\x1b[?25l';
export const SHOW_CURSOR = '\x1b[?25h';

export const setChar = (str: string, index: number, char: string) => {
	if (index >= str.length) return str;
	return str.substring(0, index) + char + str.substring(index + 1);
};

export interface ColorizedString {
	str: string;
	color: Chalk;
}

const RESET_COLOR = (chalk.reset as any)._styler.open;

export const joinColorizedStrings = (strings: ColorizedString[]) => {
	let line = '';
	let currentColor = RESET_COLOR;

	for (const { str, color } of strings) {
		const { open } = (color as any)._styler;
		if (currentColor !== open) {
			line += open;
			currentColor = open;
		}

		line += str;
	}

	return line + RESET_COLOR;
};

export const isNumber = (char: string) => !Number.isNaN(Number(char));
