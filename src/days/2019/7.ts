import { AoCPart } from '../../types';
import { IntcodeProgram } from './intcode';

function permutations<T>(arr: T[]): T[][] {
	const results: T[][] = [];

	function permute(arr: T[], memo: T[]): T[][] {
		let cur: T[];

		for (let i = 0; i < arr.length; i++) {
			cur = arr.splice(i, 1);
			if (!arr.length) {
				results.push(memo.concat(cur));
			}

			permute(arr.slice(), memo.concat(cur));
			arr.splice(i, 0, cur[0]);
		}

		return results;
	}

	return permute(arr, []);
}

function runAmplifiers(programBody: number[], phaseSettings: number[]): number {
	let currentOutput = 0;

	for (let i = 0; i < 5; i++) {
		const program = new IntcodeProgram(programBody.join(','));
		program.input(phaseSettings[i], currentOutput);

		const output = program.nextOutput();
		if (output === undefined) throw new Error('Could not find output');

		currentOutput = output;
	}

	return currentOutput;
}

export const part1: AoCPart = ([input]) => {
	let maxSignal = 0;

	const settingPermutations = permutations([0, 1, 2, 3, 4]);

	for (const settings of settingPermutations) {
		let currentSignal = 0;

		for (let i = 0; i < 5; i++) {
			const program = new IntcodeProgram(input);
			program.input(settings[i], currentSignal);

			const output = program.nextOutput();
			if (output === undefined) throw new Error('Could not find output');

			currentSignal = output;
		}

		if (currentSignal > maxSignal) {
			maxSignal = currentSignal;
		}
	}

	return maxSignal;
};

export const part2: AoCPart = ([input]) => {
	const settingPermutations = permutations([5, 6, 7, 8, 9]);

	let maxSignal = 0;

	for (const settings of settingPermutations) {
		const programs = settings.map(v => {
			const program = new IntcodeProgram(input);
			program.input(v);
			return program;
		});

		programs[0].input(0);

		let currentSignal = 0;

		main: while (true) {
			for (let i = 0; i < programs.length; i++) {
				const output = programs[i].nextOutput();
				if (output === undefined) break main;

				currentSignal = output;
				programs[(i + 1) % programs.length].input(currentSignal);
			}
		}

		if (currentSignal > maxSignal) {
			maxSignal = currentSignal;
		}
	}

	return maxSignal;
};
