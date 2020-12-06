const input = require('./input.json');

// Part 1
const groups = input.reduce((acc, line) => {
	if (line === '') {
		return [...acc, ''];
	} else {
		return [
			...acc.slice(0, acc.length - 1),
			(acc[acc.length - 1] || '') + line,
		];
	}
}, []);

const yesCount = groups.reduce((acc, group) => {
	const found = group.split('').reduce((acc, char) => {
		if (acc.includes(char)) return acc;
		return [...acc, char];
	});

	return acc + found.length;
}, 0);

console.log('Part 1:', yesCount);

// Part 2
const newGroups = input.reduce((acc, line) => {
	if (line === '') {
		return [...acc, []];
	} else {
		return [
			...acc.slice(0, acc.length - 1),
			[...(acc[acc.length - 1] || []), line],
		];
	}
}, []);

const newYesCount = newGroups.reduce((acc, group) => {
	const { length } = group;
	const counts = group
		.join('')
		.split('')
		.reduce((acc, char) => {
			const { [char]: curr = 0 } = acc;
			return { ...acc, [char]: curr + 1 };
		}, {});

	return acc + Object.values(counts).filter(count => count >= length).length;
}, 0);

console.log('Part 2:', newYesCount);
