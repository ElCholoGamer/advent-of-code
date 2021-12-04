import { AoCPart } from '../../types';

const MAX_INT16 = Math.pow(2, 16);

interface WireOperation {
	target: string;
	operator: string;
	leftHand?: string | number;
	rightHand: string | number;
}

const tryParse = (str: string) => (isNaN(Number(str)) ? str : Number(str));

function parseOperation(line: string): WireOperation {
	const [sourceStr, target] = line.split(' -> ');

	const sourceArgs = sourceStr.split(' ');

	let operator: string;
	let rightHand: string | number;
	let leftHand: string | number | undefined;

	if (sourceArgs.length === 1) {
		operator = '+';
		rightHand = tryParse(sourceArgs[0]);
	} else if (sourceArgs[0] === 'NOT') {
		operator = 'NOT';
		rightHand = tryParse(sourceArgs[1]);
	} else {
		leftHand = tryParse(sourceArgs[0]);
		operator = sourceArgs[1];
		rightHand = tryParse(sourceArgs[2]);
	}

	return { target, rightHand, operator, leftHand };
}

function runOperations(
	wires: Record<string, number>,
	operations: WireOperation[],
	overrideWires: string[] = []
) {
	const getValue = (val: string | number) => (typeof val === 'string' ? wires[val] : val);

	do {
		const newOperations: WireOperation[] = [];
		for (let i = 0; i < operations.length; i++) {
			const { target, operator, rightHand, leftHand } = operations[i];

			if (
				(typeof rightHand === 'string' && !(rightHand in wires)) ||
				(typeof leftHand === 'string' && !(leftHand in wires))
			) {
				newOperations.push(operations[i]);
				continue;
			}

			if (overrideWires.includes(target)) continue;

			const rightValue = getValue(rightHand);

			if (operator === '+') {
				wires[target] = rightValue;
			} else if (operator === 'NOT') {
				wires[target] = ~rightValue;
			} else {
				if (!leftHand) throw new Error('Operation left hand required');

				const leftValue = getValue(leftHand);

				switch (operator) {
					case 'AND':
						wires[target] = leftValue & rightValue;
						break;
					case 'OR':
						wires[target] = leftValue | rightValue;
						break;
					case 'RSHIFT':
						wires[target] = leftValue >>> rightValue;
						break;
					case 'LSHIFT':
						wires[target] = leftValue << rightValue;
						break;
					default:
						throw new Error('Invalid operator: ' + operator);
				}
			}

			wires[target] %= MAX_INT16;
			while (wires[target] < 0) wires[target] += MAX_INT16;
		}

		operations = newOperations;
	} while (operations.length > 0);

	return wires;
}

export const part1: AoCPart = input => {
	const operations = input.map(parseOperation);
	const wires = runOperations({}, operations);

	return wires.a;
};

export const part2: AoCPart = async input => {
	const a = <number>await part1(input);

	const operations = input.map(parseOperation);
	const wires = runOperations({ b: a }, operations, ['b']);

	return wires.a;
};
