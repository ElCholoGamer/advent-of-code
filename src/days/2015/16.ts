import { AoCPart } from '../../types';

interface Sue {
	children: number;
	cats: number;
	samoyeds: number;
	pomeranians: number;
	akitas: number;
	vizslas: number;
	goldfish: number;
	trees: number;
	cars: number;
	perfumes: number;
}

const CORRECT_SUE: Readonly<Sue> = {
	children: 3,
	cats: 7,
	samoyeds: 2,
	pomeranians: 3,
	akitas: 0,
	vizslas: 0,
	goldfish: 5,
	trees: 3,
	cars: 2,
	perfumes: 1,
};

function parseSue(line: string) {
	const propsStr = line.replace(/^Sue [0-9]+: /, '');

	return propsStr.split(', ').reduce<Partial<Sue>>((props, propStr) => {
		const [name, value] = propStr.split(': ');
		return { ...props, [name]: Number(value) };
	}, {});
}

export const part1: AoCPart = input => {
	const sues = input.map((line, i) => ({ ...parseSue(line), index: i + 1 }));
	const properties = Object.keys(CORRECT_SUE);

	const possibleSues = sues.filter(sue =>
		properties.every(
			prop => !(prop in sue) || sue[<keyof Sue>prop] === CORRECT_SUE[<keyof Sue>prop]
		)
	);

	if (possibleSues.length > 1) throw new Error('More than one possible result');
	if (possibleSues.length === 0) throw new Error('No matching Sues found');

	return possibleSues[0].index;
};

export const part2: AoCPart = input => {
	const sues = input.map((line, i) => ({ ...parseSue(line), index: i + 1 }));
	const properties = Object.keys(CORRECT_SUE).filter(
		p => !['cats', 'trees', 'pomeranians', 'goldfish'].includes(p)
	);

	const possibleSues = sues.filter(sue => {
		if ('cats' in sue && sue.cats! <= CORRECT_SUE.cats) return false;
		if ('trees' in sue && sue.trees! <= CORRECT_SUE.trees) return false;
		if ('pomeranians' in sue && sue.pomeranians! >= CORRECT_SUE.pomeranians) return false;
		if ('goldfish' in sue && sue.goldfish! >= CORRECT_SUE.goldfish) return false;

		return properties.every(
			prop => !(prop in sue) || sue[<keyof Sue>prop] === CORRECT_SUE[<keyof Sue>prop]
		);
	});

	if (possibleSues.length > 1) throw new Error('More than one possible Sue');
	if (possibleSues.length === 0) throw new Error('No matching Sues found');

	return possibleSues[0].index;
};
