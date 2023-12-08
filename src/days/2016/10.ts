import { AoCPart } from '../../types';

interface Instruction {
	done: boolean;
}

interface ValueInstruction extends Instruction {
	target: number;
	value: number;
}

interface ComparisonInstruction extends Instruction {
	from: number;
	lowTarget: ChipTarget;
	highTarget: ChipTarget;
}

function parseInstruction(
	line: string,
): ValueInstruction | ComparisonInstruction {
	const words = line.split(' ');

	if (words[0] === 'value') {
		return {
			target: Number(words[words.length - 1]),
			value: Number(words[1]),
			done: false,
		};
	}

	const from = Number(words[1]);
	const lowTarget = parseChipTarget(words[5], Number(words[6]));
	const highTarget = parseChipTarget(words[10], Number(words[11]));

	return { from, lowTarget, highTarget, done: false };
}

interface ChipTarget {
	output: boolean;
	index: number;
}

function parseChipTarget(label: string, index: number): ChipTarget {
	return {
		output: label === 'output',
		index,
	};
}

function isValueInstruction(
	instruction: Instruction,
): instruction is ValueInstruction {
	return (instruction as ValueInstruction).value !== undefined;
}

function doComparisonAndGiveChips(
	bots: number[][],
	outputs: number[][],
	instruction: ComparisonInstruction,
) {
	const { from, lowTarget, highTarget } = instruction;

	const lower = Math.min(...bots[from]);
	const higher = Math.max(...bots[from]);

	if (lowTarget.output) {
		outputs[lowTarget.index] ||= [];
		outputs[lowTarget.index].push(lower);
	} else {
		bots[lowTarget.index] ||= [];
		bots[lowTarget.index].push(lower);
	}

	if (highTarget.output) {
		outputs[highTarget.index] ||= [];
		outputs[highTarget.index].push(higher);
	} else {
		bots[highTarget.index] ||= [];
		bots[highTarget.index].push(higher);
	}

	bots[from] = [];
}

export const part1: AoCPart = (input) => {
	const bots: number[][] = [];
	const outputs: number[][] = [];

	let instructions = input.map(parseInstruction);

	while (instructions.length > 0) {
		for (const instruction of instructions) {
			if (isValueInstruction(instruction)) {
				bots[instruction.target] ||= [];
				bots[instruction.target].push(instruction.value);

				instruction.done = true;
				continue;
			} else if (bots[instruction.from]?.length === 2) {
				if (
					bots[instruction.from].includes(61) &&
					bots[instruction.from].includes(17)
				) {
					return instruction.from;
				}

				doComparisonAndGiveChips(bots, outputs, instruction);
				instruction.done = true;
			}
		}

		instructions = instructions.filter((i) => !i.done);
	}

	throw new Error('Could not find result');
};

export const part2: AoCPart = (input) => {
	const bots: number[][] = [];
	const outputs: number[][] = [];

	let instructions = input.map(parseInstruction);

	while (instructions.length > 0) {
		for (const instruction of instructions) {
			if (isValueInstruction(instruction)) {
				bots[instruction.target] ||= [];
				bots[instruction.target].push(instruction.value);

				instruction.done = true;
			} else if (bots[instruction.from]?.length === 2) {
				doComparisonAndGiveChips(bots, outputs, instruction);
				instruction.done = true;
			}
		}

		instructions = instructions.filter((i) => !i.done);
	}

	return outputs[0][0] * outputs[1][0] * outputs[2][0];
};
