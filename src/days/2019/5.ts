import { AoCPart } from '../../types';
import { parseProgramBody, runProgram } from './intcode';

export const part1: AoCPart = ([input]) => {
	const body = parseProgramBody(input);
	const { outputs } = runProgram(body, [1]);

	for (let i = 0; i < outputs.length - 1; i++) {
		if (outputs[i] !== 0) {
			throw new Error('Failed diagnostic test with output ' + outputs[i]);
		}
	}

	return outputs[outputs.length - 1];
};

export const part2: AoCPart = ([input]) => {
	const body = parseProgramBody(input);
	const program = runProgram(body, [5]);

	return program.outputs[0];
};
