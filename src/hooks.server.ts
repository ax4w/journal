import type { Handle, HandleServerError } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	return await resolve(event);
};

export const handleError: HandleServerError = async ({ error, event }) => {
	// Log the error
	console.error('Server error:', error);

	// Check if it's a body size limit error
	if (error instanceof Error && error.message.includes('Content-length') && error.message.includes('exceeds limit')) {
		return {
			message: 'File size too large. Maximum upload size is 50MB.',
			code: 'FILE_TOO_LARGE'
		};
	}

	return {
		message: 'Internal Server Error',
		code: 'INTERNAL_ERROR'
	};
};
