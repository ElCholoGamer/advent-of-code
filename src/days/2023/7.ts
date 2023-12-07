import { AoCPart } from '../../types';

const strengthOrder = 'J23456789TJQKA';

const enum HandType {
  HighCard,
  OnePair,
  TwoPair,
  ThreeOfAKind,
  FullHouse,
  FourOfAKind,
  FiveOfAKind,
}

interface Hand {
  handString: string;
  type: HandType;
  bid: number;
}

function parseHand(str: string, joker: boolean): Hand {
  const [handString, bidStr] = str.split(' ');

  const cardCounts = new Map<string, number>();

  for (let c = 0; c < handString.length; c++) {
    const char = handString[c];
    cardCounts.set(char, (cardCounts.get(char) ?? 0) + 1);
  }

  if (joker) {
    const jokerCount = cardCounts.get('J');
    if (jokerCount) {
      // The joker will replace the card with the highest count
      let maxCount = 0;
      let maxCountCard = '';

      for (const [card, count] of cardCounts.entries()) {
        if (card !== 'J' && count > maxCount) {
          maxCount = count;
          maxCountCard = card;
        }
      }

      cardCounts.set(maxCountCard, maxCount + jokerCount);
      cardCounts.delete('J');
    }
  }

  const values = [...cardCounts.values()];
  let type: HandType;

  if (cardCounts.size === 1) {
    type = HandType.FiveOfAKind;
  } else if (cardCounts.size === 2) {
    if (values.includes(4)) {
      type = HandType.FourOfAKind;
    } else {
      type = HandType.FullHouse;
    }
  } else if (cardCounts.size === 3) {
    if (values.includes(3)) {
      type = HandType.ThreeOfAKind;
    } else {
      type = HandType.TwoPair;
    }
  } else if (cardCounts.size === 4) {
    type = HandType.OnePair;
  } else {
    type = HandType.HighCard;
  }

  return {
    handString,
    type,
    bid: Number(bidStr),
  };
}

function solution(input: string[], joker: boolean): number {
  const hands = input.map((line) => parseHand(line, joker));

  hands.sort((a, b) => {
    if (a.type !== b.type) return a.type - b.type;

    for (let c = 0; c < a.handString.length; c++) {
      const valA = strengthOrder.indexOf(a.handString[c]);
      const valB = strengthOrder.indexOf(b.handString[c]);

      if (valA !== valB) return valA - valB;
    }

    return 0;
  });

  return hands.map((hand, i) => hand.bid * (i + 1)).reduce((a, b) => a + b);
}

export const part1: AoCPart = (input) => solution(input, false);
export const part2: AoCPart = (input) => solution(input, true);
