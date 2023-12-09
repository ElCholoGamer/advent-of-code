import { AoCPart } from '../../types';

function computeProgression(line: string) {
	const layers = [line.split(' ').map(Number)];

	while (true) {
		const lastLayer = layers[layers.length - 1];
		const nextLayer = [...Array(lastLayer.length - 1)].map(
			(_, i) => lastLayer[i + 1] - lastLayer[i],
		);

		if (nextLayer.every((n) => n === 0)) break;
		layers.push(nextLayer);
	}

	return layers;
}

export const part1: AoCPart = (input) => {
	const layersList = input.map(computeProgression);

	let sum = 0;

	for (const layers of layersList) {
		sum += layers
			.map((layer) => layer[layer.length - 1])
			.reduce((a, b) => a + b);
	}

	return sum;
};

export const part2: AoCPart = (input) => {
	const layersList = input.map(computeProgression);

	let sum = 0;

	for (const layers of layersList) {
		let prevTerm = 0;

		for (let i = layers.length - 1; i >= 0; i--) {
			prevTerm = layers[i][0] - prevTerm;
		}

		sum += prevTerm;
	}

	return sum;
};
