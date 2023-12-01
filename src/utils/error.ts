export function assertNonNull<T>(value: T | null, message = 'Non null assertion failed') {
	if (value === undefined || value === null) throw new Error(message);
	return value;
}
