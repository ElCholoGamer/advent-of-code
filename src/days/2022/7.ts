import { AoCPart } from '../../types';

interface File {
	name: string;
	size: number;
	parent: Directory;
}

interface Directory {
	name: string;
	parent: Directory | null;
	children: FileSystemItem[];
}

type FileSystemItem = File | Directory;

function isDirectory(item: FileSystemItem): item is Directory {
	return typeof (item as File).size !== 'number';
}

function buildDirectoryTree(lines: string[]) {
	let currentDir: Directory = {
		name: '/',
		parent: null,
		children: [],
	};

	for (let i = 1; i < lines.length; ) {
		const [, command, targetDirName] = lines[i].split(/\s+/);
		i++;

		if (command === 'cd') {
			if (targetDirName === '..') {
				if (!currentDir.parent) throw new Error('Cannot move up from root');
				currentDir = currentDir.parent;
			} else {
				const targetDir = currentDir.children
					.filter(isDirectory)
					.find(item => item.name === targetDirName);
				if (!targetDir) throw new Error('Directory not found');

				currentDir = targetDir;
			}
		} else {
			while (i < lines.length && !lines[i].startsWith('$')) {
				const [prefix, name] = lines[i].split(/\s+/);
				if (prefix === 'dir') {
					currentDir.children.push({
						name,
						parent: currentDir,
						children: [],
					});
				} else {
					currentDir.children.push({
						name,
						parent: currentDir,
						size: parseInt(prefix),
					});
				}
				i++;
			}
		}
	}

	// Find root directory
	while (currentDir.parent) {
		currentDir = currentDir.parent;
	}

	return currentDir;
}

function calculateSize(item: FileSystemItem, onDirectorySize: (size: number) => void): number {
	if (!isDirectory(item)) return item.size;

	const dirSize = item.children
		.map(child => calculateSize(child, onDirectorySize))
		.reduce((a, b) => a + b);

	onDirectorySize(dirSize);
	return dirSize;
}

export const part1: AoCPart = input => {
	const rootDir = buildDirectoryTree(input);

	let sum = 0;
	calculateSize(rootDir, dirSize => {
		if (dirSize <= 100_000) sum += dirSize;
	});

	return sum;
};

export const part2: AoCPart = input => {
	const rootDir = buildDirectoryTree(input);

	const sizes: number[] = [];
	const usedSpace = calculateSize(rootDir, size => sizes.push(size));
	const missingSpace = 30_000_000 - (70_000_000 - usedSpace);

	sizes.sort((a, b) => a - b);
	const sizeToDelete = sizes.find(size => size >= missingSpace);
	if (!sizeToDelete) throw new Error('No directory is big enough');

	return sizeToDelete;
};
