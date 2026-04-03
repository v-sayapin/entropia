import plugin from 'fastify-plugin';
import type { FastifyPluginAsync } from 'fastify';

import { SECURITY_REPORT_DEFINITIONS } from 'server/app/security/reporting/definitions';
import {
	REPORT_BODY_LIMIT_BYTES,
	REPORT_CONTENT_TYPE,
	createInvalidReportJsonError,
	parseReportJson,
} from 'server/app/security/reporting/parser';
import { REPORT_RESPONSE_SCHEMA } from 'server/app/security/reporting/schema';

const SECURITY_REPORTING_RATE_LIMIT_CONFIG = {
	max: 30,
	timeWindow: '1 minute',
} as const;

const securityReportingPluginDecorator: FastifyPluginAsync = async (app) => {
	app.addContentTypeParser(
		REPORT_CONTENT_TYPE,
		{ parseAs: 'string', bodyLimit: REPORT_BODY_LIMIT_BYTES },
		(_request, body, done) => {
			try {
				done(null, parseReportJson(body.toString()));
			} catch {
				done(createInvalidReportJsonError());
			}
		}
	);

	SECURITY_REPORT_DEFINITIONS.forEach(({ endpoint, schema }) =>
		app.post<{ Body: unknown }>(
			`/${endpoint}`,
			{
				config: {
					rateLimit: SECURITY_REPORTING_RATE_LIMIT_CONFIG,
				},
				schema: {
					body: schema,
					response: REPORT_RESPONSE_SCHEMA,
				},
			},
			async (request, reply) => {
				request.log.warn(
					{
						securityReportEndpoint: endpoint,
						securityReport: request.body,
					},
					'browser security report'
				);

				return reply.code(204).send();
			}
		)
	);
};

export const securityReportingPlugin = plugin(securityReportingPluginDecorator, {
	name: 'security-reporting',
	dependencies: ['rate-limit'],
	encapsulate: true,
});
