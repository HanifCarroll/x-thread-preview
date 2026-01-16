import { watch, type FSWatcher } from 'chokidar';
import { readFile } from 'fs/promises';
import { existsSync } from 'fs';
import type { ThreadData } from '$lib/types';
import { defaultThread } from '$lib/types';

const THREAD_FILE_PATH = process.env.THREAD_FILE_PATH ||
	'/Users/hanifcarroll/Library/Mobile Documents/iCloud~md~obsidian/Documents/hanif-md/tmp/thread-preview.json';

const IMAGES_BASE_PATH = process.env.IMAGES_BASE_PATH ||
	'/Users/hanifcarroll/Library/Mobile Documents/iCloud~md~obsidian/Documents/hanif-md/tmp';

type Listener = (data: ThreadData) => void;

class ThreadWatcher {
	private watcher: FSWatcher | null = null;
	private listeners: Set<Listener> = new Set();
	private currentData: ThreadData = defaultThread;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;

	async start() {
		if (this.watcher) return;

		// Load initial data
		await this.loadFile();

		// Watch the file
		this.watcher = watch(THREAD_FILE_PATH, {
			persistent: true,
			ignoreInitial: true
		});

		this.watcher.on('change', () => {
			// Debounce rapid changes
			if (this.debounceTimer) {
				clearTimeout(this.debounceTimer);
			}
			this.debounceTimer = setTimeout(() => {
				this.loadFile();
			}, 100);
		});

		// Also watch the directory for when file is created
		this.watcher.on('add', () => {
			this.loadFile();
		});

		console.log(`[ThreadWatcher] Watching: ${THREAD_FILE_PATH}`);
	}

	private async loadFile() {
		try {
			if (!existsSync(THREAD_FILE_PATH)) {
				console.log('[ThreadWatcher] File does not exist yet');
				return;
			}

			const content = await readFile(THREAD_FILE_PATH, 'utf-8');
			const data = JSON.parse(content) as ThreadData;

			// Transform image paths to be served from the API
			if (data.tweets) {
				data.tweets = data.tweets.map(tweet => {
					if (tweet.image) {
						// Convert absolute/relative paths to API endpoint
						const imageName = tweet.image.split('/').pop();
						tweet.image = `/api/images/${imageName}`;
					}
					return tweet;
				});
			}

			this.currentData = data;
			this.notifyListeners();
			console.log(`[ThreadWatcher] Loaded ${data.tweets?.length || 0} tweets`);
		} catch (error) {
			console.error('[ThreadWatcher] Error loading file:', error);
		}
	}

	private notifyListeners() {
		for (const listener of this.listeners) {
			listener(this.currentData);
		}
	}

	subscribe(listener: Listener): () => void {
		this.listeners.add(listener);
		// Send current data immediately
		listener(this.currentData);

		return () => {
			this.listeners.delete(listener);
		};
	}

	getData(): ThreadData {
		return this.currentData;
	}

	stop() {
		if (this.watcher) {
			this.watcher.close();
			this.watcher = null;
		}
		if (this.debounceTimer) {
			clearTimeout(this.debounceTimer);
		}
	}
}

// Singleton instance
export const threadWatcher = new ThreadWatcher();

// Export paths for image serving
export { IMAGES_BASE_PATH };
