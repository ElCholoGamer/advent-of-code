import chalk from 'chalk';
import { AoCPart, Visualization } from '../../types';
import { sleep } from '../../utils';
import { chunks } from '../../utils/arrays';
import { HIDE_CURSOR, SHOW_CURSOR } from '../../utils/strings';

const parseInstruction = (str: string) =>
	str === 'noop' ? null : parseInt(str.split(' ')[1]);

export const part1: AoCPart = (input) => {
	const instructions = input.map(parseInstruction);
	let cycle = 0;
	let xReg = 1;
	let signalSum = 0;
	let nextSignalCycle = 20;

	function nextCycle() {
		cycle++;
		if (cycle >= nextSignalCycle) {
			nextSignalCycle += 40;
			signalSum += cycle * xReg;
		}
	}

	for (const maybeAddX of instructions) {
		nextCycle();
		if (maybeAddX !== null) {
			nextCycle();
			xReg += maybeAddX;
		}
	}

	return signalSum;
};

export const part2: AoCPart = (input) => {
	const instructions = input.map(parseInstruction);
	let cycle = 0;
	let xReg = 1;

	const pixels = Array<boolean>(240).fill(false);

	function nextCycle() {
		const pixelXPosition = cycle % 40;
		pixels[cycle] = pixelXPosition >= xReg - 1 && pixelXPosition <= xReg + 1;
		cycle++;
	}

	for (const maybeAddX of instructions) {
		nextCycle();
		if (maybeAddX !== null) {
			nextCycle();
			xReg += maybeAddX;
		}
	}

	return (
		'\n' +
		chunks(pixels, 40)
			.map((lineData) => lineData.map((p) => (p ? '##' : '  ')).join(''))
			.join('\n')
	);
};

export const visualization: Visualization = async (input) => {
	const instructions = input.map(parseInstruction);

	let cycle = 0;
	let xReg = 1;
	const pixels = Array<boolean>(240).fill(false);

	function render(instructionIndex: number) {
		console.clear();
		const lineChars = chunks(pixels, 40).map((line, y) =>
			line.map((b, x) =>
				chalk[y * 40 + x === cycle ? 'bgWhite' : b ? 'bgGreen' : 'bgGray'](
					'  ',
				),
			),
		);

		console.log(
			chalk.blue`Cycles: ${cycle.toString().padEnd(5)} X: ${xReg.toString()}`,
		);
		console.log();
		console.log(
			[...Array(40)]
				.map((_, index) =>
					Math.abs(xReg - index) <= 1 ? chalk.bgYellow('  ') : '  ',
				)
				.join(''),
		);

		const lines = lineChars.map((row) => row.join(''));
		for (let i = 0; i < lines.length; i++) {
			const lineInstructionIndex = instructionIndex - 2 + i;
			if (
				lineInstructionIndex < 0 ||
				lineInstructionIndex >= instructions.length
			)
				continue;

			const maybeAddX = instructions[lineInstructionIndex];
			let extra = maybeAddX === null ? 'noop' : `addx ${maybeAddX}`;

			if (lineInstructionIndex === instructionIndex) {
				lines[i] += `   ${chalk.yellow`> ${extra}`}`;
			} else {
				lines[i] += `     ${chalk.gray(extra)}`;
			}
		}

		console.log(lines.join('\n'));
	}

	async function nextCycle(instructionIndex: number) {
		const pixelXPosition = cycle % 40;
		pixels[cycle] = pixelXPosition >= xReg - 1 && pixelXPosition <= xReg + 1;
		cycle++;

		render(instructionIndex);
		await sleep(50);
	}

	console.log(HIDE_CURSOR);
	render(-1);
	await sleep(500);

	for (let i = 0; i < instructions.length; i++) {
		await nextCycle(i);
		const maybeAddX = instructions[i];
		if (maybeAddX !== null) {
			await nextCycle(i);
			xReg += maybeAddX;
		}
	}

	console.log(SHOW_CURSOR);
};
