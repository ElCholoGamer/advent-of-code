import { AoCPart } from '../../types';

function runProgram(program: number[]): number {
	program = [...program];

	for (let i = 0; i < program.length; i += 4) {
		const op = program[i];
		if (op === 99) break;

		if (op !== 1 && op !== 2) throw new Error('Invalid opcode: ' + op);

		const left = program[program[i + 1]];
		const right = program[program[i + 2]];
		const to = program[i + 3];

		program[to] = op === 1 ? left + right : left * right;
	}

	return program[0];
}

export const part1: AoCPart = ([input]) => {
	const program = input.split(',').map(Number);

	program[1] = 12;
	program[2] = 2;

	return runProgram(program);
};

interface Options {
	expectedOutput?: number;
}

export const part2: AoCPart<Options> = ([input], { expectedOutput = 19690720 }) => {
	const program = input.split(',').map(Number);

	for (let noun = 0; noun < 100; noun++) {
		program[1] = noun;
		for (let verb = 0; verb < 100; verb++) {
			program[2] = verb;
			const result = runProgram(program);
			if (result === expectedOutput) {
				return 100 * noun + verb;
			}
		}
	}

	throw new Error('Out of bounds');
};
