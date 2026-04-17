export type JsonSchema = Readonly<Record<string, unknown>>;

export const REPORT_RESPONSE_SCHEMA = { 204: { type: 'null' } } as const;

const REPORT_VALUE_SCHEMA = {
	anyOf: [
		{ type: 'string', maxLength: 4096 },
		{ type: 'number' },
		{ type: 'boolean' },
		{ type: 'null' },
	],
} as const;

const REPORT_BODY_SCHEMA = {
	type: 'object',
	minProperties: 1,
	maxProperties: 32,
	additionalProperties: REPORT_VALUE_SCHEMA,
} as const;

const createReportEnvelopeSchema = (type: string): JsonSchema => ({
	type: 'object',
	required: ['age', 'type', 'url', 'user_agent', 'body'],
	additionalProperties: false,
	properties: {
		age: { type: 'number', minimum: 0 },
		body: REPORT_BODY_SCHEMA,
		type: { type: 'string', enum: [type] },
		url: { type: 'string', maxLength: 4096 },
		user_agent: { type: 'string', maxLength: 1024 },
	},
});

export const createReportListSchema = (type: string): JsonSchema => ({
	type: 'array',
	minItems: 1,
	maxItems: 20,
	items: createReportEnvelopeSchema(type),
});
