import { AoCPart } from '../../types';
import { Vector2, Vector3 } from '../../utils/vector';

interface Instruction {
	turn: string;
	rangeX: Vector2;
	rangeY: Vector2;
	rangeZ: Vector2;
}

function parseInstruction(line: string): Instruction {
	const [turn, ranges] = line.split(' ');

	const [rangeX, rangeY, rangeZ] = ranges
		.split(',')
		.map((str) => Vector2.fromArray(str.split('=')[1].split('..').map(Number)));

	return { turn, rangeX, rangeY, rangeZ };
}

function pointVsAAABBB(point: Vector3, aaa: Vector3, bbb: Vector3) {
	return equalOrGreaterThan(point, aaa) && equalOrLessThan(point, bbb);
}

function pointVsAAABBBExclusive(point: Vector3, aaa: Vector3, bbb: Vector3) {
	return greaterThan(point, aaa) && lessThan(point, bbb);
}

function clamp(num: number, min: number, max: number): number {
	return Math.min(Math.max(num, min), max);
}

class Cuboid {
	public constructor(public from: Vector3, public to: Vector3) {}

	public size(): Vector3 {
		return this.to.clone().subtract(this.from);
	}

	public getVertices(): Vector3[] {
		const size = this.size();

		return [
			this.from.clone(),
			this.from.clone().add(new Vector3(size.x, 0, 0)),
			this.from.clone().add(new Vector3(0, size.y, 0)),
			this.from.clone().add(new Vector3(size.x, size.y, 0)),
			this.from.clone().add(new Vector3(0, 0, size.z)),
			this.from.clone().add(new Vector3(size.x, 0, size.z)),
			this.from.clone().add(new Vector3(0, size.y, size.z)),
			this.from.clone().add(new Vector3(size.x, size.y, size.z)),
		];
	}

	public intersects(cuboid: Cuboid): boolean {
		if (
			this.to.x > cuboid.from.x &&
			this.from.x < cuboid.to.x &&
			this.to.y > cuboid.from.y &&
			this.from.y < cuboid.to.y &&
			this.to.z > cuboid.from.z &&
			this.from.z < cuboid.to.z
		)
			return true;

		return false;
	}

	public volume(): number {
		const size = this.size();
		return size.x * size.y * size.z;
	}

	public fixVertices() {
		const { from, to } = this;

		if (from.x > to.x) {
			[from.x, to.x] = [to.x, from.x];
		}

		if (from.y > to.y) {
			[from.y, to.y] = [to.y, from.y];
		}

		if (from.z > to.z) {
			[from.z, to.z] = [to.z, from.z];
		}
	}

	public isValid() {
		return greaterThan(this.to, this.from);
	}
}

function greaterThan(vec1: Vector3, vec2: Vector3) {
	return vec1.x > vec2.x && vec1.y > vec2.y && vec1.z > vec2.z;
}

function equalOrGreaterThan(vec1: Vector3, vec2: Vector3) {
	return vec1.x >= vec2.x && vec1.y >= vec2.y && vec1.z >= vec2.z;
}

function lessThan(vec1: Vector3, vec2: Vector3) {
	return vec1.x < vec2.x && vec1.y < vec2.y && vec1.z < vec2.z;
}

function equalOrLessThan(vec1: Vector3, vec2: Vector3) {
	return vec1.x <= vec2.x && vec1.y <= vec2.y && vec1.z <= vec2.z;
}

function getTotalVolume(cuboids: Cuboid[]): number {
	const volumes = cuboids.map((cuboid) => cuboid.volume());
	return volumes.reduce((a, b) => a + b, 0);
}

function getDifferentAxis(v1: Vector3, v2: Vector3): number {
	return v1.toArray().findIndex((pos, i) => v2.toArray()[i] !== pos);
}

function getCommonAxis(vectors: Vector3[]): number {
	return vectors[0]
		.toArray()
		.findIndex((pos, i) => vectors.every((other) => other.toArray()[i] === pos));
}

function makeVertexPartition(from: Vector3, to: Vector3, v: number) {
	const sideIndex = v % 4;

	if (v >= 4) {
		// Vertice at Z: 1
		[from.z, to.z] = [to.z, from.z];
	}

	if (sideIndex === 1 || sideIndex === 3) {
		// Vertice at 1, 0 or 1, 1
		[from.x, to.x] = [to.x, from.x];
	}

	if (sideIndex === 2 || sideIndex === 3) {
		// Vertice at 0, 1 or 1, 1
		[from.y, to.y] = [to.y, from.y];
	}

	return new Cuboid(from, to);
}

function splitIntersections(cuboids: Cuboid[], cuboid: Cuboid): Cuboid[] {
	// Remove smaller overlapping cuboids
	cuboids = cuboids.filter(
		(other) =>
			!(
				equalOrGreaterThan(other.from, cuboid.from) &&
				equalOrLessThan(other.to, cuboid.to)
			)
	);

	const intersects = cuboids.filter(
		(other) => cuboid !== other && cuboid.intersects(other)
	);
	cuboids = cuboids.filter((other) => !intersects.includes(other));

	// Split intersections into multiple cuboids
	for (const intersect of intersects) {
		// console.log('---- intersection start ---- VOLUME:', intersect.volume());
		const vertices = cuboid.getVertices();
		const otherVertices = intersect.getVertices();

		// Vertex partitions
		for (let v = 0; v < vertices.length; v++) {
			if (pointVsAAABBB(otherVertices[v], cuboid.from, cuboid.to)) continue;

			const partition = makeVertexPartition(
				otherVertices[v].clone(),
				vertices[v].clone(),
				v
			);
			if (partition.isValid()) {
				// console.log('Adding vertex partition with volume:', partition.volume());
				cuboids.push(partition);
			}
		}

		// Face partitions
		const faces = [
			[0, 1, 2, 3], // +Z
			[4, 5, 6, 7], // -Z
			[2, 3, 6, 7], // +Y
			[0, 1, 4, 5], // -Y
			[1, 3, 5, 7], // +X
			[0, 2, 4, 6], // -X
		];

		for (const vertexIndices of faces) {
			const fromFace = vertexIndices.map((v) => vertices[v].clone());
			const toFace = vertexIndices.map((v) => otherVertices[v].clone());

			const commonAxisIndex = getCommonAxis(fromFace);

			if (commonAxisIndex === -1) throw new Error('No common face axis found');
			const commonAxis = commonAxisIndex === 0 ? 'x' : commonAxisIndex === 1 ? 'y' : 'z';

			if (
				toFace.some((vertex) => {
					const pos = vertex[commonAxis];

					const facesWithSameDiffAxis = faces
						.map((face) => face.map((v) => vertices[v]))
						.filter((face) => getCommonAxis(face) === commonAxisIndex);

					if (facesWithSameDiffAxis.length !== 2)
						throw new Error('Faces with same common axis must be 2');

					const [min, max] = facesWithSameDiffAxis
						.map((vec) => vec[0][commonAxis])
						.sort((a, b) => a - b);

					return pos >= min && pos <= max;
				})
			) {
				continue;
			}

			// Clamp face size
			for (let axis = 0; axis < 3; axis++) {
				if (axis === commonAxisIndex) continue;

				for (let v = 0; v < fromFace.length; v++) {
					const vertex = toFace[v].toArray();

					vertex[axis] = clamp(
						vertex[axis],
						fromFace[0].toArray()[axis],
						fromFace[3].toArray()[axis]
					);
					toFace[v] = Vector3.fromArray(vertex);
				}
			}

			const allVertices = [
				...toFace,
				...toFace.map((vertex) => {
					vertex = vertex.clone();
					vertex[commonAxis] = fromFace[3][commonAxis];
					return vertex;
				}),
			];

			allVertices.sort((a, b) => a[commonAxis] - b[commonAxis]);

			const partition = new Cuboid(allVertices[0], allVertices[allVertices.length - 1]);
			partition.fixVertices();

			// console.log('Adding face partition with volume:', partition.volume());
			cuboids.push(partition);
		}

		// Edge partitions
		const edgeIndices = [
			[0, 1],
			[2, 3],
			[4, 5],
			[6, 7],
			[0, 2],
			[1, 3],
			[4, 6],
			[5, 7],
			[0, 4],
			[1, 5],
			[2, 6],
			[3, 7],
		];

		const edges = edgeIndices.map((edge) => edge.map((v) => vertices[v]));
		const otherEdges = edgeIndices.map((edge) => edge.map((v) => otherVertices[v]));

		for (let e = 0; e < edges.length; e++) {
			const edge = edges[e].map((vec) => vec.clone());
			const otherEdge = otherEdges[e].map((vec) => vec.clone());

			const diffAxis = getDifferentAxis(edge[0], edge[1]);

			if (
				otherEdge.some((vertex) => {
					const pos = Vector2.fromArray(
						vertex.toArray().filter((_, i) => i !== diffAxis)
					);

					const edgesWithSameDiffAxis = edges.filter(
						(edge) => getDifferentAxis(edge[0], edge[1]) === diffAxis
					);

					if (edgesWithSameDiffAxis.length !== 4)
						throw new Error('Edges with the same different axis must be 4');

					const [from, , , to] = edgesWithSameDiffAxis.map((edge) =>
						Vector2.fromArray(edge[0].toArray().filter((_, i) => i !== diffAxis))
					);

					return (pos.x >= from.x && pos.x <= to.x) || (pos.y >= from.y && pos.y <= to.y);
				})
			)
				continue;

			if (diffAxis === -1) throw new Error('No different edge axis found');

			// Clamp edge length
			for (let v = 0; v < edge.length; v++) {
				const vertex = otherEdge[v].toArray();

				vertex[diffAxis] = clamp(
					vertex[diffAxis],
					edge[0].toArray()[diffAxis],
					edge[1].toArray()[diffAxis]
				);

				otherEdge[v] = Vector3.fromArray(vertex);
			}

			const endpointArr = otherEdge[1].toArray();

			for (let axis = 0; axis < 3; axis++) {
				if (axis === diffAxis) continue;

				const diff = edge[1].toArray()[axis] - endpointArr[axis];
				endpointArr[axis] += diff;
			}

			const partition = new Cuboid(otherEdge[0], Vector3.fromArray(endpointArr));
			partition.fixVertices();

			// console.log('Adding edge partition with volume:', partition.volume());
			cuboids.push(partition);
		}
	}

	return cuboids;
}

function rebootReactor(instructions: Instruction[]): Cuboid[] {
	let cuboids: Cuboid[] = [];

	for (const { turn, rangeX, rangeY, rangeZ } of instructions) {
		const cuboid = new Cuboid(
			new Vector3(rangeX.x, rangeY.x, rangeZ.x),
			new Vector3(rangeX.y + 1, rangeY.y + 1, rangeZ.y + 1)
		);

		if (turn === 'on') {
			if (!cuboids.length) {
				cuboids.push(cuboid);
				continue;
			}

			cuboids = splitIntersections(cuboids, cuboid);
			cuboids.push(cuboid);
		} else if (cuboids.length) {
			cuboids = splitIntersections(cuboids, cuboid);
		}
	}

	return cuboids;
}

export const part1: AoCPart = (input) => {
	const maxRange = 50;
	const instructions = input
		.map(parseInstruction)
		.filter((i) =>
			[i.rangeX, i.rangeY, i.rangeZ].every(
				(range) => range.x < maxRange && range.y > -maxRange
			)
		);
	const cuboids = rebootReactor(instructions);

	return getTotalVolume(cuboids);
};

export const part2: AoCPart = (input) => {
	const instructions = input.map(parseInstruction);
	const cuboids = rebootReactor(instructions);

	return getTotalVolume(cuboids);
};
