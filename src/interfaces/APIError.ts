import httpStatus from "http-status";

interface APIErrorConstructor {
	message: string;
	status?: number;
	field?: string;
	isPublic?: boolean;
	desc?: string;
}
class APIError extends Error {
	public desc?: string;
	public field?: string;
	public isPublic: boolean;
	public status: number;
	constructor({
		message,
		field,
		isPublic,
		status,
		desc,
	}: APIErrorConstructor) {
		super(message);
		this.isPublic = isPublic ?? false;
		this.status = status ?? httpStatus.INTERNAL_SERVER_ERROR;
		this.field = field;
		this.desc = desc;
	}
}

export default APIError;
