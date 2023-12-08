import { AoCPart } from '../../types';
import { chunks } from '../../utils/arrays';
import { lcm } from '../../utils/math';

const enum Operand {
	ADD,
	MULTIPLY,
}

interface Monkey {
	items: number[];
	operation: {
		operand: Operand;
		num: number | null;
	};
	testDivisible: number;
	throwIfTrue: number;
	throwIfFalse: number;
	inspectCount: number;
}

function parseMonkeys(input: string[]): Monkey[] {
	return chunks(input, 7).map((lines) => {
		const startingItems = lines[1].split(': ')[1].split(', ').map(Number);
		const operationWords = lines[2].split(' = ')[1].split(/\s+/);

		return {
			items: startingItems,
			operation: {
				operand: operationWords[1] === '+' ? Operand.ADD : Operand.MULTIPLY,
				num: operationWords[2] === 'old' ? null : parseInt(operationWords[2]),
			},
			testDivisible: parseInt(lines[3].split(/\s+/).at(-1)!),
			throwIfTrue: parseInt(lines[4].split(/\s+/).at(-1)!),
			throwIfFalse: parseInt(lines[5].split(/\s+/).at(-1)!),
			inspectCount: 0,
		};
	});
}

function monkeyBusinessAfterRounds(
	monkeys: Monkey[],
	rounds: number,
	divideByThree: boolean,
) {
	const moduloDivisor = lcm(...monkeys.map((monkey) => monkey.testDivisible));

	for (let r = 0; r < rounds; r++) {
		for (const monkey of monkeys) {
			monkey.inspectCount += monkey.items.length;

			while (monkey.items.length > 0) {
				let worryLevel = monkey.items.shift()!;
				const rightNum = monkey.operation.num ?? worryLevel;
				worryLevel =
					monkey.operation.operand === Operand.ADD
						? worryLevel + rightNum
						: worryLevel * rightNum;

				if (divideByThree) worryLevel = Math.floor(worryLevel / 3);

				worryLevel %= moduloDivisor;

				monkeys[
					worryLevel % monkey.testDivisible === 0
						? monkey.throwIfTrue
						: monkey.throwIfFalse
				].items.push(worryLevel);
			}
		}
	}

	monkeys.sort((a, b) => b.inspectCount - a.inspectCount);
	return monkeys[0].inspectCount * monkeys[1].inspectCount;
}

export const part1: AoCPart = (input) =>
	monkeyBusinessAfterRounds(parseMonkeys(input), 20, true);

export const part2: AoCPart = (input) =>
	monkeyBusinessAfterRounds(parseMonkeys(input), 10000, false);
