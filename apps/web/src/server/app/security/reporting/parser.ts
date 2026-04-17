import sjson from 'secure-json-parse';

export const REPORT_CONTENT_TYPE = 'application/reports+json';

export const REPORT_BODY_LIMIT_BYTES = 64 * 1024;

export const createInvalidReportJsonError = (): Error & { statusCode: number } =>
	Object.assign(new Error('Invalid security report JSON'), { statusCode: 400 });

export const parseReportJson = (body: string): unknown => sjson.parse(body);
