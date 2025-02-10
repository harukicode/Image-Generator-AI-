export const asyncHandler = (fn) => (req, res, next) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};


export const ResponseFormatter = {
	success(data) {
		return {
			success: true,
			data
		};
	},
	
	error(message, details = null) {
		return {
			success: false,
			error: message,
			...(details && { details })
		};
	}
};