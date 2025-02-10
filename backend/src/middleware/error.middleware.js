export const errorHandler = (err, req, res, next) => {
	console.error('Error:', err);
	
	if (err.type === 'ValidationError') {
		return res.status(400).json({
			success: false,
			error: err.message
		});
	}
	
	if (err.type === 'NotFoundError') {
		return res.status(404).json({
			success: false,
			error: err.message
		});
	}
	
	return res.status(500).json({
		success: false,
		error: err.message || 'Internal server error'
	});
};


export const notFoundHandler = (req, res) => {
	res.status(404).json({
		success: false,
		error: 'Requested resource not found'
	});
};


export class ValidationError extends Error {
	constructor(message) {
		super(message);
		this.type = 'ValidationError';
	}
}

export class NotFoundError extends Error {
	constructor(message) {
		super(message);
		this.type = 'NotFoundError';
	}
}