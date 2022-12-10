import { AoCPart } from '../../types';
import { chunks } from '../../utils/arrays';

const parseInstruction = (str: string) => (str === 'noop' ? null : parseInt(str.split(' ')[1]));

export const part1: AoCPart = input => {
	const instructions = input.map(parseInstruction);
	let cycle = 0;
	let xReg = 1;
	let signalSum = 0;
	let nextSignalCycle = 20;

	function nextCycle() {
		cycle++;
		if (cycle >= nextSignalCycle) {
			nextSignalCycle += 40;
			signalSum += cycle * xReg;
		}
	}

	for (const maybeAddX of instructions) {
		nextCycle();
		if (maybeAddX !== null) {
			nextCycle();
			xReg += maybeAddX;
		}
	}

	return signalSum;
};

export const part2: AoCPart = input => {
	const instructions = input.map(parseInstruction);
	let cycle = 0;
	let xReg = 1;

	const pixels = Array<boolean>(240).fill(false);

	function nextCycle() {
		const pixelXPosition = cycle % 40;
		pixels[cycle] = pixelXPosition >= xReg - 1 && pixelXPosition <= xReg + 1;
		cycle++;
	}

	for (const maybeAddX of instructions) {
		nextCycle();
		if (maybeAddX !== null) {
			nextCycle();
			xReg += maybeAddX;
		}
	}

	return (
		'\n' +
		chunks(pixels, 40)
			.map(lineData => lineData.map(p => (p ? '##' : '  ')).join(''))
			.join('\n')
	);
};
