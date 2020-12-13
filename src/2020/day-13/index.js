const input = require('./input.json');

// Part 1
const [depart] = input;
const ids = input[1]
	.split(',')
	.filter(id => id !== 'x')
	.map(id => parseInt(id));

let busses = ids.map(() => 0);

let time = 0;
while (busses.every(bus => bus < depart)) {
	time++;
	busses = busses.map((bus, index) => {
		const id = ids[index];
		if (time % id !== 0) return bus;

		return bus + id;
	});
}

const earliest = Math.min(...busses.filter(bus => bus >= depart));

const id = ids[busses.indexOf(earliest)];
const waitTime = earliest - depart;

const result = id * waitTime;
console.log('Part 1:', result);

// Part 2
busses = input[1]
	.split(',')
	.map((n, index) => [parseInt(n), index])
	.filter(n => !isNaN(n[0]));

let t = 0;
let [increment] = busses[0];

busses.slice(1).forEach(bus => {
	while ((t + bus[1]) % bus[0] !== 0) {
		t += increment;
	}

	increment *= bus[0];
});

console.log('Part 2:', t);
