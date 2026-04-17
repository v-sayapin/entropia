import { createReportListSchema } from 'server/app/security/reporting/schema';

export const COEP_REPORT = {
	endpoint: 'coep',
	schema: createReportListSchema('coep'),
} as const;

export const CSP_REPORT = {
	endpoint: 'csp',
	schema: createReportListSchema('csp-violation'),
} as const;

export const SECURITY_REPORT_DEFINITIONS = [COEP_REPORT, CSP_REPORT] as const;

type SecurityReportDefinition = (typeof SECURITY_REPORT_DEFINITIONS)[number];
export type SecurityReportEndpoint = SecurityReportDefinition['endpoint'];
