import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	let decompressed = input;
	const regex = /(?<!\([0-9]+x[0-9]+\))(\([0-9]+x[0-9]+\))/g;

	let match;
	while ((match = regex.exec(decompressed)) !== null) {
		const { index } = match;
		const [length, times] = (match[0].match(/[0-9]+/g) || []).map(match => parseInt(match));

		const str = decompressed.substr(index + match[0].length, length);

		// Add a space to these to prevent regex matching
		const repeated = str.replace(/\(/g, '( ').repeat(times);

		decompressed =
			decompressed.substr(0, index) +
			repeated +
			decompressed.substr(index + match[0].length + str.length);
	}

	return decompressed.replace(/\s+/g, '').length;
};

export const part2: AoCPart = ([input]) => {
	function decompress(str: string) {
		const regex = /(?<!\([0-9]+x[0-9]+\))(\([0-9]+x[0-9]+\))/g;

		let match;
		while ((match = regex.exec(str)) !== null) {
			const { index } = match;
			const [length, times] = (match[0].match(/[0-9]+/g) || []).map(match => parseInt(match));

			let sub = str.substr(index + match[0].length, length);
			sub = decompress(sub);

			str = str.substr(0, index) + sub.repeat(times) + str.substr(index + match[0].length + length);
		}

		return str;
	}

	return decompress(input).length;
};
