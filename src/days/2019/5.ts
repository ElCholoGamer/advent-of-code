import { AoCPart } from '../../types';
import { IntcodeProgram } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new IntcodeProgram(input);
	program.input(1);

	const outputs = program.remainingOutputs();

	for (let i = 0; i < outputs.length - 1; i++) {
		if (outputs[i] !== 0) {
			throw new Error('Failed diagnostic test with output ' + outputs[i]);
		}
	}

	return outputs[outputs.length - 1];
};

export const part2: AoCPart = ([input]) => {
	const program = new IntcodeProgram(input);
	program.input(5);

	const output = program.nextOutput();
	if (output === undefined) throw new Error('No output found');

	return output;
};
