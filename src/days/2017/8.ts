import { AoCPart } from '../../types';

function checkCondition(leftHand: number, rightHand: number, operator: string) {
	switch (operator) {
		case '>':
			return leftHand > rightHand;
		case '<':
			return leftHand < rightHand;
		case '>=':
			return leftHand >= rightHand;
		case '<=':
			return leftHand <= rightHand;
		case '==':
			return leftHand === rightHand;
		case '!=':
			return leftHand !== rightHand;
		default:
			throw new Error('Invalid operator: ' + operator);
	}
}

export const part1: AoCPart = (input) => {
	const registers: Record<string, number> = {};

	for (const line of input) {
		const [reg, action, valueStr, , cReg, cOperator, cRightHandStr] =
			line.split(/\s+/);

		const cLeftHand = registers[cReg] || 0;
		const cRightHand = Number(cRightHandStr);

		if (checkCondition(cLeftHand, cRightHand, cOperator)) {
			registers[reg] ||= 0;
			registers[reg] += Number(valueStr) * (action === 'inc' ? 1 : -1);
		}
	}

	// Highest value in any register
	return Object.values(registers).reduce((a, b) => (b > a ? b : a));
};

export const part2: AoCPart = (input) => {
	const registers: Record<string, number> = {};
	let highestValue = 0;

	for (const line of input) {
		const [reg, action, valueStr, , cReg, cOperator, cRightHandStr] =
			line.split(/\s+/);

		const cLeftHand = registers[cReg] || 0;
		const cRightHand = Number(cRightHandStr);

		if (checkCondition(cLeftHand, cRightHand, cOperator)) {
			const newValue =
				(registers[reg] || 0) + Number(valueStr) * (action === 'inc' ? 1 : -1);
			registers[reg] = newValue;

			if (newValue > highestValue) highestValue = newValue;
		}
	}

	return highestValue;
};
