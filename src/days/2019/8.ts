import { AoCPart } from '../../types';

interface Options {
	imageWidth?: number;
	imageHeight?: number;
}

function characterCount(layer: string[], character: string) {
	return layer
		.join('')
		.split('')
		.reduce((sum, char) => sum + +(char === character), 0);
}

function parselayers(
	input: string,
	imageWidth: number,
	imageHeight: number,
): string[][] {
	const layers: string[][] = [[]];

	for (let i = 0; i < input.length; i += imageWidth) {
		if (layers[layers.length - 1].length >= imageHeight) {
			layers.push([]);
		}

		layers[layers.length - 1].push(input.substring(i, i + imageWidth));
	}

	return layers;
}

export const part1: AoCPart<Options> = (
	[input],
	{ imageWidth = 25, imageHeight = 6 },
) => {
	const layers = parselayers(input, imageWidth, imageHeight);
	const zeroCounts = layers.map((layer, index) => [
		index,
		characterCount(layer, '0'),
	]);

	const layerWithLessZeros = zeroCounts.reduce((a, b) =>
		a[1] < b[1] ? a : b,
	)[0];

	const ones = characterCount(layers[layerWithLessZeros], '1');
	const twos = characterCount(layers[layerWithLessZeros], '2');

	return ones * twos;
};

export const part2: AoCPart<Options> = (
	[input],
	{ imageWidth = 25, imageHeight = 6 },
) => {
	const layers = parselayers(input, imageWidth, imageHeight);

	const finalImage: string[] = [];

	for (let row = 0; row < imageHeight; row++) {
		let line = '';

		for (let pos = 0; pos < imageWidth; pos++) {
			for (const layer of layers) {
				const char = layer[row][pos];

				if (char === '2') continue;

				line += char === '1' ? '#' : '.';
				break;
			}
		}

		finalImage.push(line.split('').join(' '));
	}

	return '\n' + finalImage.join('\n');
};
