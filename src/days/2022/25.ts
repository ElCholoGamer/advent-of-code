import { AoCPart } from '../../types';

function parseSNAFU(str: string) {
	let value = 0;

	for (let d = 0; d < str.length; d++) {
		const char = str[str.length - d - 1];
		let digitValue = parseInt(char);

		if (isNaN(digitValue)) {
			digitValue = char === '-' ? -1 : -2;
		}
		value += digitValue * Math.pow(5, d);
	}

	return value;
}

function toSNAFU(num: number) {
	const reverseChars: string[] = [];

	while (num > 0) {
		const digitValue = num % 5;
		num = Math.floor(num / 5);

		if (digitValue >= 3) {
			num++;
			reverseChars.push(digitValue === 3 ? '=' : '-');
		} else {
			reverseChars.push(digitValue.toString());
		}
	}

	return reverseChars.reverse().join('');
}

export const part1: AoCPart = (input) => {
	const numbers = input.map(parseSNAFU);
	const sum = numbers.reduce((a, b) => a + b);
	return toSNAFU(sum);
};
