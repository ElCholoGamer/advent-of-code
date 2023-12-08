import { AoCPart } from '../../types';
import { chunks, enumerate } from '../../utils/arrays';

type PacketDataArray = (number | PacketDataArray)[];

const enum Comparison {
	RIGHT = -1,
	EQUAL,
	WRONG,
}

function parsePacketData(str: string) {
	const stack: PacketDataArray[] = [];

	for (let c = 0; c < str.length; c++) {
		const char = str[c];

		if (char === '[') {
			stack.push([]);
		} else if (char === ']') {
			const packetData = stack.pop()!;
			if (stack.length === 0) return packetData;
			stack.at(-1)!.push(packetData);
		} else if (char !== ',') {
			let numStr = char;
			while (!isNaN(Number(str[c + 1]))) {
				numStr += str[++c];
			}

			stack.at(-1)!.push(parseInt(numStr));
		}
	}

	throw new Error('missing end bracket');
}

function parsePacketPairs(
	input: string[],
): [PacketDataArray, PacketDataArray][] {
	return chunks(input, 3).map(([first, second]) => [
		parsePacketData(first),
		parsePacketData(second),
	]);
}

function compareValues(
	a: number | PacketDataArray,
	b: number | PacketDataArray,
): Comparison {
	if (typeof a === 'number' && typeof b === 'number') {
		return Math.sign(a - b) as Comparison;
	}

	if (typeof a === 'number') a = [a];
	if (typeof b === 'number') b = [b];

	const maxLength = Math.max(a.length, b.length);

	for (let i = 0; i < maxLength; i++) {
		if (i >= a.length) return Comparison.RIGHT;
		if (i >= b.length) return Comparison.WRONG;

		const result = compareValues(a[i], b[i]);
		if (result !== Comparison.EQUAL) return result;
	}

	return Comparison.EQUAL;
}

export const part1: AoCPart = (input) => {
	const pairs = enumerate(parsePacketPairs(input));
	const ordered = pairs.filter(
		([, [a, b]]) => compareValues(a, b) === Comparison.RIGHT,
	);

	return ordered.reduce((sum, [index]) => sum + index + 1, 0);
};

export const part2: AoCPart = (input) => {
	const pairs = parsePacketPairs(input).flat();
	const div1 = [[2]];
	const div2 = [[6]];
	pairs.push(div1, div2);

	pairs.sort((a, b) => compareValues(a, b));
	return (pairs.indexOf(div1) + 1) * (pairs.indexOf(div2) + 1);
};
