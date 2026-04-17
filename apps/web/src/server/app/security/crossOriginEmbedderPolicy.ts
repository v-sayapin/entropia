import { COEP_REPORT } from 'server/app/security/reporting/definitions';

export const CROSS_ORIGIN_EMBEDDER_POLICY_HEADER = `require-corp; report-to="${COEP_REPORT.endpoint}"`;
