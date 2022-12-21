import { AoCPart } from '../../types';

type MonkeyMap = Record<string, number | Operation | null>;

interface Operation {
	leftMonkey: string;
	rightMonkey: string;
	sign: string;
}

function parseOperation(str: string): Operation {
	const words = str.split(/\s+/);
	return {
		leftMonkey: words[0],
		rightMonkey: words[2],
		sign: words[1],
	};
}

function parseMonkeys(input: string[]) {
	const monkeys: MonkeyMap = {};

	for (const line of input) {
		const [monkey, value] = line.split(': ');
		const numValue = parseInt(value);

		monkeys[monkey] = !isNaN(numValue) ? numValue : parseOperation(value);
	}

	return monkeys;
}

function fillMonkeyValues(monkeys: MonkeyMap) {
	function fillMonkeyValue(monkey: string) {
		const operation = monkeys[monkey];
		if (operation === null || typeof operation === 'number') return;

		fillMonkeyValue(operation.leftMonkey);
		fillMonkeyValue(operation.rightMonkey);
		const left = monkeys[operation.leftMonkey];
		const right = monkeys[operation.rightMonkey];

		if (typeof left !== 'number' || typeof right !== 'number') return;

		switch (operation.sign) {
			case '+':
				monkeys[monkey] = left + right;
				break;
			case '-':
				monkeys[monkey] = left - right;
				break;
			case '*':
				monkeys[monkey] = left * right;
				break;
			case '/':
				monkeys[monkey] = left / right;
				break;
			default:
				throw new Error('invalid operation sign');
		}
	}

	fillMonkeyValue('root');
}

export const part1: AoCPart = input => {
	const monkeys = parseMonkeys(input);
	fillMonkeyValues(monkeys);

	return monkeys.root as number;
};

export const part2: AoCPart = input => {
	const monkeys = parseMonkeys(input);
	monkeys.humn = null;
	fillMonkeyValues(monkeys);

	function fixValue(monkey: string, target: number) {
		const operation = monkeys[monkey];
		if (typeof operation === 'number') throw new Error('cannot fix a number');

		if (operation === null) {
			monkeys[monkey] = target;
			return;
		}

		const isRightANumber = typeof monkeys[operation.rightMonkey] === 'number';
		const knownNumber = monkeys[operation[isRightANumber ? 'rightMonkey' : 'leftMonkey']] as number;

		let nextTarget: number;
		switch (operation.sign) {
			case '+':
				nextTarget = target - knownNumber;
				break;
			case '-':
				if (isRightANumber) {
					nextTarget = target + knownNumber;
				} else {
					nextTarget = knownNumber - target;
				}
				break;
			case '*':
				nextTarget = target / knownNumber;
				break;
			case '/':
				if (isRightANumber) {
					nextTarget = target * knownNumber;
				} else {
					nextTarget = knownNumber / target;
				}
				break;
			default:
				throw new Error('invalid sign');
		}

		fixValue(isRightANumber ? operation.leftMonkey : operation.rightMonkey, nextTarget);
	}

	const root = monkeys.root as Operation;
	const humnSideMonkey =
		typeof monkeys[root.rightMonkey] === 'number' ? root.leftMonkey : root.rightMonkey;
	const target = monkeys[
		humnSideMonkey === root.leftMonkey ? root.rightMonkey : root.leftMonkey
	] as number;

	fixValue(humnSideMonkey, target);

	if (typeof monkeys.humn !== 'number') throw new Error('could not find value of humn');
	return monkeys.humn;
};
