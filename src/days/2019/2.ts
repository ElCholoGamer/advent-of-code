import { AoCPart } from '../../types';
import { parseProgramBody, runProgram } from './intcode';

export const part1: AoCPart = ([input]) => {
	const body = parseProgramBody(input);

	body[1] = 12;
	body[2] = 2;

	const program = runProgram(body);
	return program.body[0];
};

interface Options {
	expectedOutput?: number;
}

export const part2: AoCPart<Options> = ([input], { expectedOutput = 19690720 }) => {
	const body = parseProgramBody(input);

	for (let noun = 0; noun < 100; noun++) {
		body[1] = noun;
		for (let verb = 0; verb < 100; verb++) {
			body[2] = verb;
			const program = runProgram(body);
			if (program.body[0] === expectedOutput) {
				return 100 * noun + verb;
			}
		}
	}

	throw new Error('Out of bounds');
};
