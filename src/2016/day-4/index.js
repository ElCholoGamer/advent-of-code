const input = require('./input.json');

// Part 1
const realRooms = input.reduce((acc, room) => {
	const [name, other] = room.split(/-(?=[0-9]+\[[a-z]+\]$)/);
	const [, , letters] = other.match(/^([0-9]+)\[([a-z]+)\]$/);

	const count = name
		.replace(/-/g, '')
		.split('')
		.reduce((acc, char) => {
			const { [char]: curr = 0 } = acc;
			return { ...acc, [char]: curr + 1 };
		}, {});

	const countArray = Object.keys(count).map(key => [key, count[key]]);

	countArray.sort(
		(a, b) => b[1] - a[1] || (b[0] < a[0] ? 1 : b[0] > a[0] ? -1 : 0)
	);

	for (let i = 0; i < letters.length; i++) {
		const letter = letters[i];
		const foundIndex = countArray.findIndex(count => count[0] === letter) || 0;
		if (i !== foundIndex) return acc;
	}

	return [...acc, room];
}, []);

const sum = realRooms.reduce((acc, room) => {
	const [id] = room.match(/[0-9]+/);
	return acc + parseInt(id);
}, 0);

console.log('Part 1:', sum);

// Part 2
const letters = 'abcdefghijklmnopqrstuvwxyz';

const names = realRooms.map(room => {
	const [, encrypted, idString] = room.match(/((?:[a-z]+-)+)+([0-9]+)/);
	const id = parseInt(idString);

	const name = encrypted
		.replace(/-/g, ' ')
		.trimEnd()
		.replace(/[a-z]/g, char => {
			const index = letters.indexOf(char) + id;
			return letters[index % 26];
		});
	return `${name}-${id}`;
});

const [, id] = names
	.find(name => name.startsWith('northpole object storage'))
	.split('-');
console.log('Part 2:', id);
