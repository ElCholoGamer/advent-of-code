import { AoCPart } from '../../types';
import { chunks, enumerate } from '../../utils/arrays';

type PacketData = number | PacketData[];

const enum Comparison {
	RIGHT = -1,
	EQUAL,
	WRONG,
}

function parsePacketData(str: string) {
	function parsePacketChunk(chars: string[]): PacketData {
		const packetData: PacketData = [];

		while (chars.length > 0) {
			const char = chars.shift()!;
			if (char === '[') {
				packetData.push(parsePacketChunk(chars));
			} else if (char === ']') {
				return packetData;
			} else if (char !== ',') {
				const numEnd = chars.findIndex(c => isNaN(Number(c)));
				const numStr = char + chars.splice(0, numEnd).join('');

				packetData.push(parseInt(numStr));
			}
		}

		return packetData;
	}

	return parsePacketChunk(str.split('').slice(1));
}

function parsePacketPairs(input: string[]): [PacketData, PacketData][] {
	return chunks(input, 3).map(([first, second]) => [
		parsePacketData(first),
		parsePacketData(second),
	]);
}

function compareValues(a: number | PacketData, b: number | PacketData): Comparison {
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

export const part1: AoCPart = input => {
	const pairs = enumerate(parsePacketPairs(input));
	const ordered = pairs.filter(([, [a, b]]) => compareValues(a, b) === Comparison.RIGHT);

	return ordered.reduce((sum, [index]) => sum + index + 1, 0);
};

export const part2: AoCPart = input => {
	const pairs = parsePacketPairs(input).flat();
	const div1 = [[2]];
	const div2 = [[6]];
	pairs.push(div1, div2);

	pairs.sort((a, b) => compareValues(a, b));
	return (pairs.indexOf(div1) + 1) * (pairs.indexOf(div2) + 1);
};
