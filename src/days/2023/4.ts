import console from 'console';
import { AoCPart } from '../../types';

interface Card {
	numbers: number[];
	winningNumbers: number[];
}

function parseCard(str: string): Card {
	const [winningStr, numStr] = str.split(': ')[1].split(' | ');
	return {
		numbers: numStr.split(/\s+/).map(Number),
		winningNumbers: winningStr.split(/\s+/).map(Number),
	};
}

export const part1: AoCPart = (input) => {
	const cards = input.map(parseCard);

	let sum = 0;

	for (const card of cards) {
		let matchCount = 0;

		for (const number of card.numbers) {
			if (card.winningNumbers.includes(number)) {
				matchCount++;
			}
		}

		if (matchCount > 0) sum += 2 ** (matchCount - 1);
	}

	return sum;
};

export const part2: AoCPart = (input) => {
	const cards = input.map(parseCard);

	const cardCount = Array(cards.length).fill(1);

	for (let c = 0; c < cardCount.length; c++) {
		const card = cards[c];
		const instanceCount = cardCount[c];

		let matchCount = 0;

		for (const number of card.numbers) {
			if (card.winningNumbers.includes(number)) {
				matchCount++;
			}
		}

		for (let i = 1; i <= matchCount; i++) {
			cardCount[c + i] += instanceCount;
		}
	}

	return cardCount.reduce((a, b) => a + b);
};
