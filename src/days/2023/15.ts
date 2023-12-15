import { AoCPart } from '../../types';

type Step = {
	hash: number;
	label: string;
} & (
	| {
			type: 'remove';
	  }
	| {
			type: 'put';
			focalLength: number;
	  }
);

function HASH(str: string) {
	let currentValue = 0;

	for (let c = 0; c < str.length; c++) {
		const code = str.charCodeAt(c);
		currentValue = ((currentValue + code) * 17) % 256;
	}

	return currentValue;
}

export const part1: AoCPart = (input) => {
	const strings = input.join(',').split(',');
	return strings.map(HASH).reduce((a, b) => a + b);
};

function parseSteps(input: string[]): Step[] {
	const strings = input.join(',').split(',');

	return strings.map((str) => {
		if (str.includes('-')) {
			const label = str.replace('-', '');
			return {
				type: 'remove',
				hash: HASH(label),
				label,
			};
		} else {
			const [label, focalLengthStr] = str.split('=');
			return {
				type: 'put',
				hash: HASH(label),
				label,
				focalLength: Number(focalLengthStr),
			};
		}
	});
}

interface LensInSlot {
	label: string;
	focalLength: number;
}

export const part2: AoCPart = (input) => {
	const steps = parseSteps(input);
	const boxes: LensInSlot[][] = [...Array(256)].map(() => []);

	for (const step of steps) {
		const box = boxes[step.hash];

		if (step.type === 'remove') {
			boxes[step.hash] = box.filter((lens) => lens.label !== step.label);
		} else {
			const existingLens = box.find((lens) => lens.label === step.label);

			if (!existingLens) {
				box.push({
					label: step.label,
					focalLength: step.focalLength,
				});
			} else {
				existingLens.focalLength = step.focalLength;
			}
		}
	}

	return boxes
		.map(
			(box, b) =>
				(b + 1) *
				box
					.map((lens, l) => (l + 1) * lens.focalLength)
					.reduce((a, b) => a + b, 0),
		)
		.reduce((a, b) => a + b);
};
