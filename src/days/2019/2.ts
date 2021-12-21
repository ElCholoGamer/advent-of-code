import { AoCPart } from '../../types';
import { IntcodeProgram } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new IntcodeProgram(input);

	program.memory[1] = 12;
	program.memory[2] = 2;

	program.nextOutput();

	return program.memory[0];
};

interface Options {
	expectedOutput?: number;
}

export const part2: AoCPart<Options> = ([input], { expectedOutput = 19690720 }) => {
	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			const program = new IntcodeProgram(input);

			program.memory[1] = noun;
			program.memory[2] = verb;

			program.nextOutput();

			if (program.memory[0] === expectedOutput) {
				return 100 * noun + verb;
			}
		}
	}

	throw new Error('Out of bounds');
};
