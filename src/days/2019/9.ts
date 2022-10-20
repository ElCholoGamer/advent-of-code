import { AoCPart } from '../../types';
import { ExtendedIntcodeVM } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new ExtendedIntcodeVM(input);
	program.queueInput(1);
	program.run();

	const keycode = program.nextOutput();
	if (keycode === undefined) throw new Error('Could not get output');

	return keycode;
};

export const part2: AoCPart = ([input]) => {
	const program = new ExtendedIntcodeVM(input);
	program.queueInput(2);
	program.run();

	const distressSignal = program.nextOutput();
	if (distressSignal === undefined) throw new Error('Could not get output');

	return distressSignal;
};
