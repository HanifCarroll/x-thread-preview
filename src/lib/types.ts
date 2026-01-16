export interface Author {
	name: string;
	handle: string;
	avatar?: string;
}

export interface Tweet {
	text: string;
	image?: string;
}

export interface ThreadData {
	author: Author;
	tweets: Tweet[];
}

export const defaultAuthor: Author = {
	name: 'Hanif Carroll',
	handle: 'hanaborern',
	avatar: '/avatar.jpg'
};

export const defaultThread: ThreadData = {
	author: defaultAuthor,
	tweets: [
		{ text: 'This is a preview of your thread.\n\nEdit tmp/thread-preview.json to see changes here.' }
	]
};
