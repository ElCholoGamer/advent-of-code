import { AoCPart } from '../../types';

export const part1: AoCPart = input => {
	const actions = input.map(line => {
		const [expression, destination] = line.split(' -> ');
		const [value1, operation, value2] = !expression.startsWith('NOT')
			? expression.split(' ')
			: [expression.replace('NOT ', ''), 'NOT'];

		return { value1, value2, operation, destination, done: false };
	});

	const values: Record<string, number> = {};
	do {
		actions.forEach(action => {
			const { done, operation, destination: dest } = action;
			const value1 = Number(action.value1);
			const value2 = Number(action.value2);

			if (
				done ||
				(isNaN(value1) && !(value1 in values)) ||
				(isNaN(value2) && !(value2 in values) && operation && operation !== 'NOT')
			)
				return;

			const assign1 = !isNaN(value1) ? value1 : values[value1.toString()];
			const assign2 = !isNaN(value2) ? value2 : values[value2.toString()];

			switch (operation) {
				case 'AND':
					values[dest] = assign1 & assign2;
					break;
				case 'OR':
					values[dest] = assign1 | assign2;
					break;
				case 'NOT':
					values[dest] = ~assign1;
					break;
				case 'RSHIFT':
					values[dest] = assign1 >>> assign2;
					break;
				case 'LSHIFT':
					values[dest] = assign1 << assign2;
					break;
				case undefined:
					values[dest] = assign1;
					break;
				default:
					throw new Error(`Invalid operation found: ${operation}`);
			}

			action.done = true;
		});
	} while (actions.some(action => !action.done));

	return values.a;
};

export const part2: AoCPart = async input => {
	const a = <number>await part1(input);
	const values: Record<string, number> = { a };

	const actions = input.map(line => {
		const [expression, destination] = line.split(' -> ');
		const [value1, operation, value2] = !expression.startsWith('NOT')
			? expression.split(' ')
			: [expression.replace('NOT ', ''), 'NOT'];

		return { value1, value2, operation, destination, done: false };
	});

	do {
		actions
			.filter(a => !a.done)
			.forEach(action => {
				const { value1, value2, operation, destination: dest } = action;
				if (
					(isNaN(Number(value1)) && !(value1 in values)) ||
					(isNaN(Number(value2)) && !(value2 in values) && operation && operation !== 'NOT')
				)
					return;

				const assign1 = !isNaN(Number(value1)) ? Number(value1) : values[value1];
				const assign2 = !isNaN(Number(value2)) ? Number(value2) : values[value2];
				if (!assign1 && assign1 !== 0) {
					console.log(value1);
					return;
				}

				switch (operation) {
					case 'AND':
						values[dest] = assign1 & assign2;
						break;
					case 'OR':
						values[dest] = assign1 | assign2;
						break;
					case 'NOT':
						values[dest] = ~assign1;
						break;
					case 'RSHIFT':
						values[dest] = assign1 >>> assign2;
						break;
					case 'LSHIFT':
						values[dest] = assign1 << assign2;
						break;
					case undefined:
						values[dest] = assign1;
						break;
					default:
						throw new Error(`Invalid operation found: ${operation}`);
				}

				action.done = true;
			});
	} while (actions.some(action => !action.done));

	return values.a;
};
