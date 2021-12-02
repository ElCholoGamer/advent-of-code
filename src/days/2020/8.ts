import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const passed: number[] = [];
	let currentIndex = 0;
	let acc = 0;

	while (!passed.includes(currentIndex)) {
		passed.push(currentIndex);
		const [action, numStr] = input[currentIndex].split(' ');
		if (action === 'nop') {
			currentIndex++;
			continue;
		}

		const num = Number(numStr);
		if (action === 'acc') {
			acc += num;
			currentIndex++;
		} else {
			currentIndex += num;
		}
	}

	return acc;
};

export const part2: AoCPart = input => {
	const tests = input.map((line, index, arr) => {
		const newInput = [...arr];

		if (line.includes('nop')) line = line.replace('nop', 'jmp');
		else if (line.includes('jmp')) line = line.replace('jmp', 'nop');

		newInput[index] = line;
		return newInput;
	});

	for (const test of tests) {
		let acc = 0;
		const passed: number[] = [];
		let currentIndex = 0;

		while (!passed.includes(currentIndex)) {
			passed.push(currentIndex);

			const [action, numStr] = test[currentIndex].split(' ');
			if (action === 'nop') {
				currentIndex++;
				continue;
			}

			const num = parseInt(numStr);
			if (action === 'acc') {
				acc += num;
				currentIndex++;
			} else {
				currentIndex += num;
			}

			if (currentIndex === test.length) {
				return acc;
			}
		}
	}

	throw new Error('Could not find result');
};
