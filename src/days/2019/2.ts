import { AoCPart } from '../../types';
import { ExtendedIntcodeVM } from './intcode';

export const part1: AoCPart = ([input]) => {
	const program = new ExtendedIntcodeVM(input);

	program.writeMemory(1, 12);
	program.writeMemory(2, 2);

	program.runUntilNextOutput();

	return program.readMemory(0);
};

interface Options {
	expectedOutput?: number;
}

export const part2: AoCPart<Options> = (
	[input],
	{ expectedOutput = 19690720 },
) => {
	for (let noun = 0; noun < 100; noun++) {
		for (let verb = 0; verb < 100; verb++) {
			const program = new ExtendedIntcodeVM(input);

			program.writeMemory(1, noun);
			program.writeMemory(2, verb);

			program.run();

			if (program.readMemory(0) === expectedOutput) {
				return 100 * noun + verb;
			}
		}
	}

	throw new Error('Out of bounds');
};
