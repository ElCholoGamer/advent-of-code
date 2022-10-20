import { AoCPart } from '../../types';
import { ExtendedIntcodeVM } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new ExtendedIntcodeVM(input);
	program.queueInput(1);
	program.run();

	const outputs = program.getAllOutputs();

	for (let i = 0; i < outputs.length - 1; i++) {
		if (outputs[i] !== 0) {
			throw new Error('Failed diagnostic test with output ' + outputs[i]);
		}
	}

	return outputs[outputs.length - 1];
};

export const part2: AoCPart = ([input]) => {
	const program = new ExtendedIntcodeVM(input);
	program.queueInput(5);
	program.run();

	const output = program.nextOutput();
	if (output === undefined) throw new Error('No output found');

	return output;
};
