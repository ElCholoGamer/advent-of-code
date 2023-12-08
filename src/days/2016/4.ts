import { AoCPart } from '../../types';
import { assertNonNull } from '../../utils/assertion';

function getRealRooms(input: string[]) {
	return input.reduce<string[]>((acc, room) => {
		const [name, other] = room.split(/-(?=[0-9]+\[[a-z]+\]$)/);
		const [, , letters] = other.match(/^([0-9]+)\[([a-z]+)\]$/) || [];

		const count = name
			.replace(/-/g, '')
			.split('')
			.reduce<Record<string, number>>((acc, char) => {
				const { [char]: curr = 0 } = acc;
				return { ...acc, [char]: curr + 1 };
			}, {});

		const countArray = Object.keys(count).map<[string, number]>((key) => [
			key,
			count[key],
		]);

		countArray.sort(
			(a, b) => b[1] - a[1] || (b[0] < a[0] ? 1 : b[0] > a[0] ? -1 : 0),
		);

		for (let i = 0; i < letters.length; i++) {
			const letter = letters[i];
			const foundIndex =
				countArray.findIndex((count) => count[0] === letter) || 0;
			if (i !== foundIndex) return acc;
		}

		return [...acc, room];
	}, []);
}

export const part1: AoCPart = (input) => {
	const realRooms = getRealRooms(input);

	return realRooms.reduce((acc, room) => {
		const [id] = assertNonNull(room.match(/[0-9]+/));
		return acc + parseInt(id);
	}, 0);
};

export const part2: AoCPart = async (input) => {
	const realRooms = getRealRooms(input);

	const letters = 'abcdefghijklmnopqrstuvwxyz';

	const names = realRooms.map((room) => {
		const [, encrypted, idString] = room.match(/((?:[a-z]+-)+)+([0-9]+)/) || [];
		const id = parseInt(idString);

		const name = encrypted
			.replace(/-/g, ' ')
			.trimEnd()
			.replace(/[a-z]/g, (char) => {
				const index = letters.indexOf(char) + id;
				return letters[index % 26];
			});
		return `${name}-${id}`;
	});

	return names
		.find((name) => name.startsWith('northpole object storage'))!
		.split('-')[1];
};
