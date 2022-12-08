import { AoCPart } from '../../types';

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
