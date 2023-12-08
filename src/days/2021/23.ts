import { AoCPart } from '../../types';

const amphipods = ['A', 'B', 'C', 'D'];
const energyUsage = [1, 10, 100, 1000];

interface BurrowState {
	hallway: (number | null)[];
	rooms: number[][];
}

const roomToHallway = (room: number) => 2 + room * 2;
function hallwayToRoom(pos: number): number | null {
	const index = (pos - 2) / 2;
	if (index < 0 || index >= 4 || !Number.isInteger(index)) return null;
	return index;
}

function parseInitialState(lines: string[]): BurrowState {
	const hallway = lines[1].replace(/#/g, '');
	const rows = lines
		.slice(2, lines.length - 1)
		.map((row) => row.replace(/(\s+)|#/g, ''));

	const rooms: BurrowState['rooms'] = [];

	for (let r = 0; r < rows[0].length; r++) {
		const room: number[] = [];

		for (let row = rows.length - 1; row >= 0; row--) {
			if (rows[row][r] !== '.') room.push(amphipods.indexOf(rows[row][r]));
		}

		rooms.push(room);
	}

	return {
		hallway: hallway
			.split('')
			.map((char) => (char === '.' ? null : amphipods.indexOf(char))),
		rooms,
	};
}

function cloneState(state: BurrowState): BurrowState {
	return {
		hallway: state.hallway.slice(),
		rooms: state.rooms.map((room) => room.slice()),
	};
}

function findMinimumEnergy(initialState: BurrowState) {
	const roomSize = Math.max(...initialState.rooms.map((room) => room.length));
	const stack: [state: BurrowState, currentEnergy: number][] = [
		[initialState, 0],
	];

	let minTotalEnergy = Infinity;

	while (stack.length) {
		let [state, currentEnergy] = stack.pop()!;
		const { hallway, rooms } = state;

		const completeRooms = rooms.filter(
			(room, index) =>
				room.length >= roomSize && room.every((amphipod) => amphipod === index),
		);

		const beforeFix = cloneState(state);
		const prevEnergy = currentEnergy;

		while (true) {
			let movedAtLeastOne = false;

			main: for (let h = 0; h < hallway.length; h++) {
				const amphipod = hallway[h];
				if (amphipod === null) continue;

				const destinationRoom = rooms[amphipod];
				if (destinationRoom.some((other) => other !== amphipod)) continue;

				// Destination room is valid to move into
				const from = h;
				const to = roomToHallway(amphipod);

				// Check that path is clear
				if (from < to) {
					for (let pos = from + 1; pos <= to; pos++) {
						if (hallway[pos] !== null) continue main;
					}
				} else {
					for (let pos = from - 1; pos >= to; pos--) {
						if (hallway[pos] !== null) continue main;
					}
				}

				const hallwaySteps = Math.abs(to - from);
				const roomEnterSteps = roomSize - destinationRoom.length;
				currentEnergy +=
					(hallwaySteps + roomEnterSteps) * energyUsage[amphipod];

				state.hallway[h] = null;
				destinationRoom.push(amphipod);

				if (destinationRoom.length >= roomSize) {
					completeRooms.push(destinationRoom);
				}

				movedAtLeastOne = true;
			}

			if (!movedAtLeastOne) break;
		}

		if (completeRooms.length >= 4) {
			minTotalEnergy = Math.min(minTotalEnergy, currentEnergy);
			continue;
		}

		for (let r = 0; r < rooms.length; r++) {
			const room = rooms[r];
			if (room.every((amphipod) => amphipod === r)) continue;

			const amphipod = room[room.length - 1];

			const roomLeaveSteps = roomSize + 1 - room.length;
			const hallwayStart = roomToHallway(r);

			// Check hallway to the left
			for (let pos = hallwayStart; pos >= 0; pos--) {
				if (hallway[pos] !== null) break; // An amphipod is blocking the path
				if (hallwayToRoom(pos) !== null) continue; // Position is above a room

				const hallwaySteps = hallwayStart - pos;
				const totalEnergy =
					currentEnergy +
					(roomLeaveSteps + hallwaySteps) * energyUsage[amphipod];

				const newState = cloneState(state);
				newState.rooms[r].pop();
				newState.hallway[pos] = amphipod;

				stack.push([newState, totalEnergy]);
			}

			// Check hallway to the right
			for (let pos = hallwayStart; pos < hallway.length; pos++) {
				if (hallway[pos] !== null) break; // An amphipod is blocking the path
				if (hallwayToRoom(pos) !== null) continue; // Position is above a room

				const hallwaySteps = pos - hallwayStart;
				const totalEnergy =
					currentEnergy +
					(roomLeaveSteps + hallwaySteps) * energyUsage[amphipod];

				const newState = cloneState(state);
				newState.rooms[r].pop();
				newState.hallway[pos] = amphipod;

				stack.push([newState, totalEnergy]);
			}
		}
	}

	return minTotalEnergy;
}

export const part1: AoCPart = (input) => {
	const initialState = parseInitialState(input);
	return findMinimumEnergy(initialState);
};

export const part2: AoCPart = (input) => {
	const initialState = parseInitialState(input);

	initialState.rooms[0].splice(1, 0, 3, 3);
	initialState.rooms[1].splice(1, 0, 1, 2);
	initialState.rooms[2].splice(1, 0, 0, 1);
	initialState.rooms[3].splice(1, 0, 2, 0);

	return findMinimumEnergy(initialState);
};
