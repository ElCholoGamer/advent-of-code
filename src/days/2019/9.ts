import { AoCPart } from '../../types';
import { IntcodeProgram } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new IntcodeProgram(input);
	program.input(1);

	const keycode = program.nextOutput();
	if (keycode === undefined) throw new Error('Could not get output');

	return keycode;
};

export const part2: AoCPart = ([input]) => {
	const program = new IntcodeProgram(input);
	program.input(2);

	const distressSignal = program.nextOutput();
	if (distressSignal === undefined) throw new Error('Could not get output');

	return distressSignal;
};
