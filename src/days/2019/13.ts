import { AoCPart } from '../../types';
import { IntcodeVM } from './intcode';

const enum TileID {
	EMPTY,
	WALL,
	BLOCK,
	H_PADDLE,
	BALL,
}

export const part1: AoCPart = ([input]) => {
	const vm = new IntcodeVM(input);
	vm.run();

	const outputs = vm.getAllOutputs();
	const blocks = new Set();

	for (let i = 0; i < outputs.length; i += 3) {
		const x = outputs[i];
		const y = outputs[i + 1];
		const tileId = outputs[i + 2];

		if (tileId === TileID.BLOCK) {
			blocks.add(`${x},${y}`);
		}
	}

	return blocks.size;
};

export const part2: AoCPart = async ([input]) => {
	const vm = new IntcodeVM(input);
	vm.writeMemory(0, 2);

	let instruction = [];

	let score = -1;
	let ballX = 0;
	let paddleX = 0;

	while (!vm.halted) {
		vm.step();

		if (vm.inputRequest) {
			const moveDirection = Math.sign(ballX - paddleX);
			vm.writeInput(moveDirection);
		} else {
			const output = vm.nextOutput();
			if (output === undefined) continue;

			instruction.push(output);

			if (instruction.length >= 3) {
				const [x, y, data] = instruction;

				if (x === -1 && y === 0) {
					score = data;
				} else {
					if (data === TileID.BALL) {
						ballX = x;
					} else if (data === TileID.H_PADDLE) {
						paddleX = x;
					}
				}

				instruction = [];
			}
		}
	}

	return score;
};
