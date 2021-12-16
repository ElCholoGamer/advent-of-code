import { AoCPart } from '../../types';

export const part1: AoCPart = ([input]) => {
	function getLength(data: string): number {
		let length = 0;
		let match: RegExpMatchArray | null = null;

		while ((match = data.match(/\([0-9]+x[0-9]+\)/)) !== null) {
			const { [0]: marker, index = 0 } = match;
			length += index;

			data = data.substring(index + marker.length);

			const [seqLength, repeats] = marker
				.substring(1, marker.length - 1)
				.split('x')
				.map(Number);

			const toRepeat = data.substring(0, seqLength);
			data = data.substring(seqLength);

			length += toRepeat.length * repeats;
		}

		length += data.length; // Remaining length

		return length;
	}

	return getLength(input);
};

export const part2: AoCPart = ([input]) => {
	function getLength(data: string): number {
		let length = 0;
		let match: RegExpMatchArray | null = null;

		while ((match = data.match(/\([0-9]+x[0-9]+\)/)) !== null) {
			const { [0]: marker, index = 0 } = match;
			length += index;

			data = data.substring(index + marker.length);

			const [seqLength, repeats] = marker
				.substring(1, marker.length - 1)
				.split('x')
				.map(Number);

			const toRepeat = data.substring(0, seqLength);
			data = data.substring(seqLength);

			length += getLength(toRepeat) * repeats;
		}

		length += data.length; // Remaining length

		return length;
	}

	return getLength(input);
};
