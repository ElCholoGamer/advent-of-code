export const PI_OVER_2 = Math.PI / 2;
export const TWO_PI = Math.PI * 2;

export const gcd = (a: number, b: number): number => {
	if (b === 0) return a;
	return gcd(b, a % b);
};

export const mcm = (...numbers: number[]) => {
	let result = 1;
	for (const num of numbers) {
		const divisor = gcd(result, num);
		result = (result * num) / divisor;
	}

	return result;
};

export const wrapRotation = (angle: number): number => {
	if (angle < 0) angle += Math.ceil(TWO_PI / -angle) * TWO_PI;
	return angle % TWO_PI;
};
