# Advent of Code &middot; [![Build](https://github.com/ElCholoGamer/advent-of-code/actions/workflows/build.yml/badge.svg)](https://github.com/ElCholoGamer/advent-of-code/actions/workflows/build.yml)

My own entries for the [Advent of Code](https://adventofcode.com) event.

Includes a useful CLI tool to automatically fetch puzzle input and execute code.

## CLI Usage

1. Set the `SESSION_COOKIE` variable in a `.env` file, using your own session cookie from the AoC website:

```bash
# .env
SESSION_COOKIE=abcdefghijklmnopqrstuvwxyz
```

2. Put your own code into one of the files in the `src/days/[year]` folder. The file must export 2 functions of type `AoCPart`, that must be named `part1` and `part2`, and return either a string or a number as the result.

```typescript
import { AoCDay } from '../../types';

export const part1: AoCDay = input => {
	return '[This is the result for part 1!]';
};

export const part2: AoCDay = input => {
	return '[This is the result for part 2!]';
};
```

3. Run the program from the command line, either using the `dev` script or building and using the `start` script

```bash
# Run day 4 of the current year
$ npm run dev run
# or...
$ npm run build
$ npm start run 4
```

For more information on the available flags and options, use the `help` command.
