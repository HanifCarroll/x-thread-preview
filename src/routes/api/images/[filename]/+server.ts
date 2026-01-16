import { readFile, stat } from 'fs/promises';
import { existsSync } from 'fs';
import { join } from 'path';
import { IMAGES_BASE_PATH } from '$lib/server/watcher';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params }) => {
	const { filename } = params;

	// Security: only allow image files
	const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
	const ext = filename.toLowerCase().slice(filename.lastIndexOf('.'));

	if (!allowedExtensions.includes(ext)) {
		return new Response('Invalid file type', { status: 400 });
	}

	// Security: prevent path traversal
	if (filename.includes('..') || filename.includes('/')) {
		return new Response('Invalid filename', { status: 400 });
	}

	const filePath = join(IMAGES_BASE_PATH, filename);

	if (!existsSync(filePath)) {
		return new Response('Image not found', { status: 404 });
	}

	try {
		const file = await readFile(filePath);
		const stats = await stat(filePath);

		const contentType = {
			'.jpg': 'image/jpeg',
			'.jpeg': 'image/jpeg',
			'.png': 'image/png',
			'.gif': 'image/gif',
			'.webp': 'image/webp'
		}[ext] || 'application/octet-stream';

		return new Response(file, {
			headers: {
				'Content-Type': contentType,
				'Content-Length': stats.size.toString(),
				'Cache-Control': 'no-cache'
			}
		});
	} catch (error) {
		console.error('Error serving image:', error);
		return new Response('Error reading image', { status: 500 });
	}
};
