import { AoCPart } from '../../types';

interface SnailPair {
	data: [number | SnailPair, number | SnailPair];
	parent: SnailPair | null;
}

interface NumberedSnailPair extends SnailPair {
	data: [number, number];
}

function parseSnailPair(data: string): SnailPair {
	data = data.replace(/\s+/g, '');

	const number: SnailPair = { data: [-1, -1], parent: null };

	for (let i = 1; i < data.length - 1; i++) {
		const char = data[i];
		if (char === ',') continue;

		if (char === '[') {
			const start = i;
			let openBrackets = 0;

			do {
				const otherChar = data[i++];

				if (otherChar === '[') {
					openBrackets++;
				} else if (otherChar === ']') {
					openBrackets--;
				}
			} while (openBrackets > 0);

			const subGroup = data.substring(start, i);
			const subNumber = parseSnailPair(subGroup);
			subNumber.parent = number;

			number.data[number.data.indexOf(-1)] = subNumber;
			continue;
		}

		if (isNaN(Number(char))) throw new Error('Invalid input character: ' + char);

		let numStr = char;

		while (!isNaN(Number(data[i + 1]))) {
			numStr += data[++i];
		}

		number.data[number.data.indexOf(-1)] = Number(numStr);
	}

	return number;
}

function snailMagnitude(pair: SnailPair): number {
	const [left, right] = pair.data;

	const first = typeof left === 'number' ? left : snailMagnitude(left);
	const second = typeof right === 'number' ? right : snailMagnitude(right);

	return 3 * first + 2 * second;
}

function isNumberedSnailPair(pair: SnailPair): pair is NumberedSnailPair {
	return pair.data.every(element => typeof element === 'number');
}

function findParentWithChildOnOtherSide(pair: SnailPair): SnailPair | null {
	if (!pair.parent) return null;

	const indexInParent = pair.parent.data.indexOf(pair);

	let checkingAgainst = pair.parent;
	let checking = pair.parent.parent;

	while (checking?.data[indexInParent] === checkingAgainst) {
		checkingAgainst = checking;
		checking = checking.parent;
	}

	return checking;
}

function addToSidemost(pair: SnailPair, value: number, side: 0 | 1) {
	if (typeof pair.data[side] === 'number') {
		(pair.data[side] as number) += value;
	} else {
		addToSidemost(pair.data[side] as SnailPair, value, side);
	}
}

function addToSideIfNumberElseToOtherSidemost(pair: SnailPair, value: number, side: 0 | 1) {
	if (typeof pair.data[side] === 'number') {
		(pair.data[side] as number) += value;
	} else {
		addToSidemost(pair.data[side] as SnailPair, value, side === 1 ? 0 : 1);
	}
}

function findPairToExplode(pair: SnailPair, depth: number): NumberedSnailPair | null {
	if (depth >= 4) {
		if (!isNumberedSnailPair(pair))
			throw new Error('Cannot explode a pair with non-number elements');
		return pair;
	}

	for (const element of pair.data) {
		if (typeof element === 'number') continue;

		const toExplode = findPairToExplode(element, depth + 1);
		if (toExplode !== null) return toExplode;
	}

	return null;
}

function explodePair(pair: NumberedSnailPair): void {
	if (!pair.parent) throw new Error('Cannot explode a pair without a parent');

	const indexAtParent = pair.parent.data.indexOf(pair);
	if (indexAtParent === -1) throw new Error('idk just in case');

	// Megumin moment
	if (indexAtParent === 0) {
		// Left element exploded
		addToSideIfNumberElseToOtherSidemost(pair.parent, pair.data[1], 1);

		const root = findParentWithChildOnOtherSide(pair);
		if (root !== null) {
			addToSideIfNumberElseToOtherSidemost(root, pair.data[0], 0);
		}
	} else {
		// Right element exploded
		addToSideIfNumberElseToOtherSidemost(pair.parent, pair.data[0], 0);

		const root = findParentWithChildOnOtherSide(pair);
		if (root !== null) {
			addToSideIfNumberElseToOtherSidemost(root, pair.data[1], 1);
		}
	}

	pair.parent.data[indexAtParent] = 0;
}

function findPairToSplit(pair: SnailPair): { pair: SnailPair; index: number } | null {
	for (let i = 0; i < pair.data.length; i++) {
		const element = pair.data[i];

		if (typeof element === 'number') {
			if (element < 10) continue;
			return { pair, index: i };
		}

		const result = findPairToSplit(element);
		if (result !== null) return result;
	}

	return null;
}

function splitPair(pair: SnailPair, index: number) {
	const num = pair.data[index];
	if (typeof num !== 'number') throw new Error('Cannot split a non-number element');
	const half = num / 2;

	pair.data[index] = {
		data: [Math.floor(half), Math.ceil(half)],
		parent: pair,
	};
}

function reducePair(pair: SnailPair) {
	while (true) {
		const toExplode = findPairToExplode(pair, 0);
		if (toExplode) {
			explodePair(toExplode);
			continue;
		}

		const toSplit = findPairToSplit(pair);
		if (toSplit) {
			splitPair(toSplit.pair, toSplit.index);
			continue;
		}

		break;
	}
}

function cloneSnailPair(pair: SnailPair): SnailPair {
	function verifyPairParents(pair: SnailPair) {
		for (const element of pair.data) {
			if (typeof element === 'number') continue;

			element.parent = pair;
			verifyPairParents(element);
		}
	}

	const newData = pair.data.map(element =>
		typeof element === 'number' ? element : cloneSnailPair(element)
	) as SnailPair['data'];

	const clone: SnailPair = {
		data: newData,
		parent: pair.parent,
	};

	verifyPairParents(clone);
	return clone;
}

function addSnailPairs(pair1: SnailPair, pair2: SnailPair) {
	const newPair: SnailPair = {
		data: [cloneSnailPair(pair1), cloneSnailPair(pair2)],
		parent: null,
	};

	for (const element of newPair.data) {
		(element as SnailPair).parent = newPair;
	}

	reducePair(newPair);
	return newPair;
}

export const part1: AoCPart = input => {
	const pairs = input.map(parseSnailPair);
	let rootPair = pairs[0];

	for (let i = 1; i < pairs.length; i++) {
		rootPair = addSnailPairs(rootPair, pairs[i]);
	}

	return snailMagnitude(rootPair);
};

export const part2: AoCPart = input => {
	const pairs = input.map(parseSnailPair);

	let max = 0;

	for (let i1 = 0; i1 < pairs.length; i1++) {
		for (let i2 = i1 + 1; i2 < pairs.length; i2++) {
			const sum1 = snailMagnitude(addSnailPairs(pairs[i1], pairs[i2]));
			const sum2 = snailMagnitude(addSnailPairs(pairs[i2], pairs[i1]));

			if (sum1 > max) max = sum1;
			if (sum2 > max) max = sum2;
		}
	}

	return max;
};
