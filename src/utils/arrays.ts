export const zip = <T>(a: T[], b: T[]): [T, T][] => a.map((e, index) => [e, b[index]]);

export const windows = <T>(arr: T[], windowSize: number): T[][] => {
	if (windowSize > arr.length) return [];
	return [...Array(arr.length - windowSize + 1)].map((_, index) =>
		arr.slice(index, index + windowSize)
	);
};

export const chunks = <T>(arr: T[], chunkSize: number): T[][] => {
	if (chunkSize > arr.length) return [];

	const out: T[][] = [];
	for (let i = 0; i < arr.length; i += chunkSize) {
		out.push(arr.slice(i, i + chunkSize));
	}

	return out;
};

export const count = <T>(arr: T[], predicate: (element: T, index: number) => boolean): number => {
	let count = 0;

	for (let i = 0; i < arr.length; i++) {
		if (predicate(arr[i], i)) count++;
	}

	return count;
};
