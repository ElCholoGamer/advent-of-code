import console from 'node:console';
import { AoCPart } from '../../types';

const enum Condition {
	GREATER_THAN,
	LESS_THAN,
}

interface Part {
	x: number;
	m: number;
	a: number;
	s: number;
}

type StepTarget =
	| {
			type: 'accepted' | 'rejected';
	  }
	| {
			type: 'workflow';
			workflow: string;
	  };

interface WorkflowStep {
	partValue: keyof Part;
	condition: Condition;
	comparison: number;
	target: StepTarget;
}

interface Workflow {
	steps: WorkflowStep[];
	endTarget: StepTarget;
}

function parseTarget(targetStr: string): StepTarget {
	return targetStr === 'A'
		? { type: 'accepted' }
		: targetStr === 'R'
		  ? { type: 'rejected' }
		  : {
					type: 'workflow',
					workflow: targetStr,
		    };
}

function parseInput(input: string[]) {
	const workflows = new Map<string, Workflow>();

	let l = 0;

	for (; l < input.length; l++) {
		const line = input[l];
		if (line === '') {
			l++;
			break;
		}

		const [id, content] = line.split(/\{|\}/);
		const stepsStr = content.split(',');
		const steps = stepsStr
			.slice(0, stepsStr.length - 1)
			.map<WorkflowStep>((step) => {
				const [conditionStr, targetStr] = step.split(':');

				const condition = conditionStr.includes('>')
					? Condition.GREATER_THAN
					: Condition.LESS_THAN;

				const [left, right] = conditionStr.split(/<|>/);

				return {
					type: 'conditional',
					condition,
					partValue: left as keyof Part,
					comparison: Number(right),
					target: parseTarget(targetStr),
				};
			});

		workflows.set(id, {
			steps,
			endTarget: parseTarget(stepsStr.at(-1)!),
		});
	}

	const parts: Part[] = [];

	for (; l < input.length; l++) {
		const line = input[l];
		const params = line.substring(1, line.length - 1).split(',');
		const part = params.reduce((obj, paramStr) => {
			const [key, valueStr] = paramStr.split('=');
			return {
				...obj,
				[key]: Number(valueStr),
			};
		}, {});

		parts.push(part as Part);
	}

	return {
		workflows,
		parts,
	};
}

export const part1: AoCPart = (input) => {
	const { workflows, parts } = parseInput(input);

	const accepted: Part[] = [];
	const rejected: Part[] = [];

	nextPart: for (const part of parts) {
		let workflow = workflows.get('in')!;
		let stepIndex = 0;

		while (true) {
			if (stepIndex === workflow.steps.length) {
				if (workflow.endTarget.type === 'accepted') {
					accepted.push(part);
					continue nextPart;
				} else if (workflow.endTarget.type === 'rejected') {
					rejected.push(part);
					continue nextPart;
				} else if (workflow.endTarget.type === 'workflow') {
					stepIndex = 0;
					workflow = workflows.get(workflow.endTarget.workflow)!;
				}

				continue;
			}

			const step = workflow.steps[stepIndex];

			const leftHand = part[step.partValue];
			const rightHand = step.comparison;
			const output =
				step.condition === Condition.GREATER_THAN
					? leftHand > rightHand
					: leftHand < rightHand;

			if (!output) {
				stepIndex++;
				continue;
			}

			if (step.target.type === 'accepted') {
				accepted.push(part);
				continue nextPart;
			} else if (step.target.type === 'rejected') {
				rejected.push(part);
				continue nextPart;
			} else if (step.target.type === 'workflow') {
				stepIndex = 0;
				workflow = workflows.get(step.target.workflow)!;
			}
		}
	}

	return accepted
		.map((part) => part.x + part.m + part.a + part.s)
		.reduce((a, b) => a + b, 0);
};

class Range {
	public constructor(
		public min: number,
		public max: number,
	) {}

	public get length() {
		return this.max - this.min + 1;
	}

	public clone() {
		return new Range(this.min, this.max);
	}
}

interface PartRange {
	x: Range;
	m: Range;
	a: Range;
	s: Range;
}

function clonePartRange(partRange: PartRange): PartRange {
	return {
		x: partRange.x.clone(),
		m: partRange.m.clone(),
		a: partRange.a.clone(),
		s: partRange.s.clone(),
	};
}

export const part2: AoCPart = (input) => {
	const { workflows } = parseInput(input);

	const accepted: PartRange[] = [];
	const rejected: PartRange[] = [];

	const queue: [Workflow, number, PartRange][] = [
		[
			workflows.get('in')!,
			0,
			{
				x: new Range(1, 4000),
				m: new Range(1, 4000),
				a: new Range(1, 4000),
				s: new Range(1, 4000),
			},
		],
	];

	while (queue.length !== 0) {
		const [workflow, stepIndex, partRange] = queue.pop()!;

		if (stepIndex === workflow.steps.length - 1) {
			if (workflow.endTarget.type === 'accepted') {
				accepted.push(partRange);
			} else if (workflow.endTarget.type === 'rejected') {
				rejected.push(partRange);
			} else if (workflow.endTarget.type === 'workflow') {
				queue.unshift([
					workflows.get(workflow.endTarget.workflow)!,
					0,
					partRange,
				]);
			}
			continue;
		}

		const step = workflow.steps[stepIndex];

		const splitYes = clonePartRange(partRange);
		const splitNo = clonePartRange(partRange);

		if (step.condition === Condition.GREATER_THAN) {
			splitYes[step.partValue].min = Math.max(
				step.comparison + 1,
				splitYes[step.partValue].min,
			);

			splitNo[step.partValue].max = Math.min(
				step.comparison,
				splitYes[step.partValue].max,
			);
		} else {
			splitYes[step.partValue].max = Math.min(
				step.comparison - 1,
				splitYes[step.partValue].max,
			);

			splitNo[step.partValue].min = Math.max(
				step.comparison,
				splitYes[step.partValue].min,
			);
		}

		queue.unshift([workflow, stepIndex + 1, splitNo]);

		if (step.target.type === 'accepted') {
			accepted.push(splitYes);
		} else if (step.target.type === 'rejected') {
			rejected.push(splitYes);
		} else if (step.target.type === 'workflow') {
			queue.unshift([workflows.get(step.target.workflow)!, 0, splitYes]);
		}
	}

	return accepted
		.map(
			(partRange) =>
				partRange.x.length *
				partRange.m.length *
				partRange.a.length *
				partRange.s.length,
		)
		.reduce((a, b) => a + b, 0);
};
