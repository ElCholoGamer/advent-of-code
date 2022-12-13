import chalk from 'chalk';
import { AoCPart, Visualization } from '../../types';
import { sleep } from '../../utils';
import { enumerate } from '../../utils/arrays';
import { HIDE_CURSOR, setChar } from '../../utils/strings';
import { Vector2 } from '../../utils/vector';

interface Instruction {
	amount: number;
	from: number;
	to: number;
}

function parseInput(lines: string[]) {
	const separatorIndex = lines.indexOf('');
	if (separatorIndex === -1) throw new Error('Could not find separator index');

	const pileCount = lines[separatorIndex - 1].trim().split(/\s+/).length;
	const piles: string[][] = [...Array(pileCount)].map(() => []);

	for (const line of lines.slice(0, separatorIndex - 1).reverse()) {
		for (let i = 0; i < pileCount; i++) {
			const char = line[1 + i * 4];
			if (char !== ' ') piles[i].push(char);
		}
	}

	const instructions: Instruction[] = lines.slice(separatorIndex + 1).map(line => {
		const [, amount, , from, , to] = line.split(/\s+/).map(Number);
		return { amount, from: from - 1, to: to - 1 };
	});

	return {
		piles,
		instructions,
	};
}

export const part1: AoCPart = input => {
	const { piles, instructions } = parseInput(input);

	for (const instruction of instructions) {
		for (let i = 0; i < instruction.amount; i++) {
			const crate = piles[instruction.from].pop();
			if (!crate) throw new Error('Cannot move from empty pile');
			piles[instruction.to].push(crate);
		}
	}

	return piles.map(pile => pile.at(-1)).join('');
};

export const part2: AoCPart = input => {
	const { piles, instructions } = parseInput(input);

	for (const instruction of instructions) {
		piles[instruction.to].push(...piles[instruction.from].slice(-instruction.amount));
		piles[instruction.from].length -= instruction.amount;
	}

	return piles.map(pile => pile.at(-1)).join('');
};

const findMaxPileHeight = (piles: string[][], instructions: Instruction[]) => {
	const heights = piles.map(pile => pile.length);
	let maxHeight = Math.max(...heights);

	for (const { amount, from, to } of instructions) {
		heights[from] -= amount;
		heights[to] += amount;
		if (heights[to] > maxHeight) maxHeight = heights[to];
	}

	return maxHeight;
};

export const visualization: Visualization = input => {
	const { piles, instructions } = parseInput(input);
	const innerWidth = piles.length * 4 + 3;
	const maxPileHeight = findMaxPileHeight(piles, instructions);
	const innerHeight = maxPileHeight + 2;
	const logs: string[] = [
		`   move ${instructions[0].amount} from ${instructions[0].from + 1} to ${
			instructions[0].to + 1
		}`,
	];

	let cranePos = new Vector2(0, 0);
	let pickedCrate: string | null = null;
	let allDone = false;

	const addCraneToLine = (str: string, height: number) => {
		const logIndex = 3 - height;
		if (logIndex >= 0) {
			if (logIndex < logs.length) {
				str += chalk[logIndex === 0 ? 'yellow' : 'gray'](logs[logIndex]);
			}
		} else if (allDone && logIndex === -2) {
			str += chalk.green`   ${chalk.bold('Message:')} ${piles.map(pile => pile.at(-1)).join('')}`;
		}
		const absoluteX = cranePos.x + 5;
		if (cranePos.y > height) return setChar(str, absoluteX, '|');
		if (cranePos.y === height) {
			if (!pickedCrate) return setChar(str, absoluteX, 'J');
			return str.substring(0, absoluteX - 1) + `[${pickedCrate}]` + str.substring(absoluteX + 2);
		}
		return str;
	};

	const topBar = `>=${'='.repeat(innerWidth)}=<`;
	const instructionsIter = instructions[Symbol.iterator]();
	let currentInstruction: Instruction = instructionsIter.next().value;
	let iterationCount = 0;

	console.log(HIDE_CURSOR);

	let cleared = false;
	const interval = setInterval(async () => {
		if (allDone) {
			if (--cranePos.y === 0) {
				clearInterval(interval);
				cleared = true;
			}
		} else if (pickedCrate === null) {
			const targetX = currentInstruction.from * 4;
			if (cranePos.x !== targetX) {
				if (cranePos.y > 0) {
					cranePos.y--;
				} else {
					cranePos.x += Math.sign(targetX - cranePos.x);
				}
			} else {
				const pickupPile = piles[currentInstruction.from];

				if (cranePos.y === innerHeight - pickupPile.length - 1) {
					pickedCrate = pickupPile.pop()!;
				} else {
					cranePos.y++;
				}
			}
		} else {
			const targetX = currentInstruction.to * 4;
			if (cranePos.x !== targetX) {
				if (cranePos.y > 0) {
					cranePos.y--;
				} else {
					cranePos.x += Math.sign(targetX - cranePos.x);
				}
			} else {
				const dropPile = piles[currentInstruction.to];

				if (cranePos.y === innerHeight - dropPile.length - 2) {
					dropPile.push(pickedCrate);
					pickedCrate = null;
					if (++iterationCount === currentInstruction.amount) {
						iterationCount = 0;
						const { value, done } = instructionsIter.next();
						currentInstruction = value;
						if (done) {
							allDone = true;
						} else {
							logs.unshift(
								`   move ${currentInstruction.amount} from ${currentInstruction.from + 1} to ${
									currentInstruction.to + 1
								}`
							);
							if (logs.length > 3) logs.length = 3;
						}
					}
				} else {
					cranePos.y++;
				}
			}
		}

		console.clear();
		console.log(topBar.substring(0, cranePos.x + 4) + '(-)' + topBar.substring(cranePos.x + 7));
		console.log(addCraneToLine(`| /${' '.repeat(innerWidth - 2)}\\ |`, -1));

		for (let y = 0; y < innerHeight; y++) {
			let line = addCraneToLine(`||${' '.repeat(innerWidth)}||`, y);
			for (const [pileNumber, pile] of enumerate(piles)) {
				const crateIndex = maxPileHeight - y + 1;
				if (crateIndex < pile.length) {
					const pos = 4 + pileNumber * 4;
					line = line.substring(0, pos) + `[${pile[crateIndex]}]` + line.substring(pos + 3);
				}
			}
			console.log(line);
		}
		console.log(`||${'-'.repeat(innerWidth)}||`);

		if (cleared) await sleep(3000);
	}, 50);
};
