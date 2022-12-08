export const HIDE_CURSOR = '\x1b[?25l';
export const SHOW_CURSOR = '\x1b[?25h';

export const setChar = (str: string, index: number, char: string) => {
	if (index >= str.length) return str;
	return str.substring(0, index) + char + str.substring(index + 1);
};
