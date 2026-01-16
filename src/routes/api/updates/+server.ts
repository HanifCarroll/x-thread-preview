import { threadWatcher } from '$lib/server/watcher';
import type { ThreadData } from '$lib/types';

export async function GET() {
	// Start the watcher if not already running
	await threadWatcher.start();

	const stream = new ReadableStream({
		start(controller) {
			const encoder = new TextEncoder();

			const sendData = (data: ThreadData) => {
				const message = `data: ${JSON.stringify(data)}\n\n`;
				controller.enqueue(encoder.encode(message));
			};

			// Subscribe to updates
			const unsubscribe = threadWatcher.subscribe(sendData);

			// Handle client disconnect
			return () => {
				unsubscribe();
			};
		}
	});

	return new Response(stream, {
		headers: {
			'Content-Type': 'text/event-stream',
			'Cache-Control': 'no-cache',
			'Connection': 'keep-alive'
		}
	});
}
