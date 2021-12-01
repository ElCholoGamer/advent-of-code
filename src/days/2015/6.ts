import { AoCPart } from '../../types';
import { splitInput } from '../../utils';

export const part1: AoCPart = inputStr => {
	const input = splitInput(inputStr);

	const lights = [...Array(1000)].map(() => Array(1000).fill(false));

	for (const line of input) {
		const [startX, startY, endX, endY] = (line.match(/[0-9]{1,3}/g) || []).map(Number);

		const toggle = line.indexOf('toggle') !== -1;
		const value = line.indexOf('on') !== -1;

		for (let x = startX; x <= endX; x++) {
			for (let y = startY; y <= endY; y++) {
				lights[x][y] = toggle ? !lights[x][y] : value;
			}
		}
	}

	// Count lit lights
	return lights.reduce((acc, col) => acc + col.reduce((acc, light) => acc + light, 0), 0);
};

export const part2: AoCPart = inputStr => {
	const input = splitInput(inputStr);
	const lights = [...Array(1000)].map(() => Array(1000).fill(0));

	for (const line of input) {
		const [startX, startY, endX, endY] = (line.match(/[0-9]{1,3}/g) || []).map(Number);

		const toggle = line.indexOf('toggle') !== -1;
		const value = line.indexOf('on') !== -1;

		const add = toggle ? 2 : value ? 1 : -1;

		for (let x = startX; x <= endX; x++) {
			for (let y = startY; y <= endY; y++) {
				lights[x][y] = Math.max(lights[x][y] + add, 0);
			}
		}
	}

	return lights.reduce((acc, col) => acc + col.reduce((acc, light) => acc + light, 0), 0);
};
