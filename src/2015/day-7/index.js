const input = require('./input.json');

// Part 1
// Map operations into objects
const actions = input.map(line => {
	const [expression, destination] = line.split(' -> ');
	const [value1, operation, value2] = !expression.startsWith('NOT')
		? expression.split(' ')
		: [expression.replace('NOT ', ''), 'NOT'];

	return { value1, value2, operation, destination, done: false };
});

const values = {};
do {
	actions.forEach(action => {
		const { done, value1, value2, operation, destination: dest } = action;
		if (
			done ||
			(isNaN(value1) && !(value1 in values)) ||
			(isNaN(value2) && !(value2 in values) && operation && operation !== 'NOT')
		)
			return;

		const assign1 = !isNaN(value1) ? parseInt(value1) : values[value1];
		const assign2 = !isNaN(value2) ? parseInt(value2) : values[value2];

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

const { a } = values;
console.log('Part 1:', a);

// Part 2
Object.keys(values).forEach(key => delete values[key]);
values.b = a;

actions.forEach(a => (a.done = false));

do {
	actions
		.filter(a => !a.done)
		.forEach(action => {
			const { value1, value2, operation, destination: dest } = action;
			if (
				(isNaN(value1) && !(value1 in values)) ||
				(isNaN(value2) &&
					!(value2 in values) &&
					operation &&
					operation !== 'NOT')
			)
				return;

			const assign1 = !isNaN(value1) ? parseInt(value1) : values[value1];
			const assign2 = !isNaN(value2) ? parseInt(value2) : values[value2];
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

console.log('Part 2:', values.a);
