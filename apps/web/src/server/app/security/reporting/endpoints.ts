import type { FastifyRequest } from 'fastify';

import { SECURITY_REPORT_DEFINITIONS } from 'server/app/security/reporting/definitions';
import type { SecurityReportEndpoint } from 'server/app/security/reporting/definitions';

export const SECURITY_REPORTS_PREFIX = '/_/reports';

const getPublicOrigin = (request: FastifyRequest): string =>
	`${request.protocol}://${request.host}`;

const getReportUrl = (request: FastifyRequest, endpoint: SecurityReportEndpoint): string =>
	`${getPublicOrigin(request)}${SECURITY_REPORTS_PREFIX}/${endpoint}`;

export const buildReportingEndpointsHeader = (request: FastifyRequest): string =>
	SECURITY_REPORT_DEFINITIONS.map(
		({ endpoint }) => `${endpoint}="${getReportUrl(request, endpoint)}"`
	).join(', ');
