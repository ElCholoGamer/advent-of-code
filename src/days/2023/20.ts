import { AoCPart } from '../../types';

const enum Pulse {
	LOW,
	HIGH,
}

const invert = (pulse: Pulse): Pulse => 1 - pulse;

const enum ModuleType {
	BROADCASTER,
	FLIP_FLOP,
	CONJUNCTION,
}

type Module = {
	destinations: string[];
} & (
	| {
			type: ModuleType.BROADCASTER;
	  }
	| {
			type: ModuleType.FLIP_FLOP;
			value: Pulse;
	  }
	| {
			type: ModuleType.CONJUNCTION;
			inputValues: Map<string, Pulse>;
	  }
);

function parseModules(input: string[]): Map<string, Module> {
	const modules = new Map<string, Module>();

	for (const line of input) {
		const [declaration, destinationsStr] = line.split(' -> ');
		const id =
			declaration === 'broadcaster' ? declaration : declaration.substring(1);
		const destinations = destinationsStr.split(', ');

		let module: Module;

		if (declaration[0] === '%') {
			module = {
				type: ModuleType.FLIP_FLOP,
				destinations,
				value: Pulse.LOW,
			};
		} else if (declaration[0] === '&') {
			module = {
				type: ModuleType.CONJUNCTION,
				destinations,
				inputValues: new Map(),
			};
		} else {
			module = {
				type: ModuleType.BROADCASTER,
				destinations,
			};
		}

		modules.set(id, module);
	}

	for (const [id, module] of modules) {
		for (const destinationId of module.destinations) {
			const destination = modules.get(destinationId);
			if (destination?.type === ModuleType.CONJUNCTION) {
				destination.inputValues.set(id, Pulse.LOW);
			}
		}
	}

	return modules;
}

export const part1: AoCPart = (input) => {
	const modules = parseModules(input);
	// console.log(modules);

	let lowPulses = 0;
	let highPulses = 0;

	for (let i = 0; i < 1000; i++) {
		// console.log('------------------------------');

		const queue: [string, string, Pulse][] = [
			['button', 'broadcaster', Pulse.LOW],
		];

		while (queue.length !== 0) {
			const [sourceId, moduleId, pulse] = queue.pop()!;
			// console.log(`${sourceId} -${pulse ? 'high' : 'low'}-> ${moduleId}`);

			if (pulse === Pulse.HIGH) highPulses++;
			else lowPulses++;

			const module = modules.get(moduleId);
			if (!module) continue;

			if (module.type === ModuleType.FLIP_FLOP && pulse === Pulse.HIGH)
				continue;

			let nextPulse = pulse;

			if (module.type === ModuleType.FLIP_FLOP) {
				module.value = invert(module.value);
				nextPulse = module.value;
			} else if (module.type === ModuleType.CONJUNCTION) {
				module.inputValues.set(sourceId, pulse);
				nextPulse = [...module.inputValues.values()].includes(Pulse.LOW)
					? Pulse.HIGH
					: Pulse.LOW;
			}

			for (const destinationId of module.destinations) {
				queue.unshift([moduleId, destinationId, nextPulse]);
			}
		}
	}

	console.log('Low:', lowPulses);
	console.log('High:', highPulses);
	return lowPulses * highPulses;
};

export const part2: AoCPart = (input) => {
	const modules = parseModules(input);
	// console.log(modules);

	for (let p = 1; ; p++) {
		// console.log('------------------------------');

		const queue: [string, string, Pulse][] = [
			['button', 'broadcaster', Pulse.LOW],
		];

		let rxLowPulses = 0;

		while (queue.length !== 0) {
			const [sourceId, moduleId, pulse] = queue.pop()!;
			// console.log(`${sourceId} -${pulse ? 'high' : 'low'}-> ${moduleId}`);

			if (moduleId === 'rx') {
				if (pulse === Pulse.LOW) {
					rxLowPulses++;
				} else {
					rxLowPulses = 2;
				}
				continue;
			}

			const module = modules.get(moduleId);
			if (!module) continue;

			if (module.type === ModuleType.FLIP_FLOP && pulse === Pulse.HIGH)
				continue;

			let nextPulse = pulse;

			if (module.type === ModuleType.FLIP_FLOP) {
				module.value = invert(module.value);
				nextPulse = module.value;
			} else if (module.type === ModuleType.CONJUNCTION) {
				module.inputValues.set(sourceId, pulse);
				nextPulse = [...module.inputValues.values()].includes(Pulse.LOW)
					? Pulse.HIGH
					: Pulse.LOW;
			}

			for (const destinationId of module.destinations) {
				queue.unshift([moduleId, destinationId, nextPulse]);
			}
		}

		if (rxLowPulses === 1) {
			return p;
		}
	}
};
