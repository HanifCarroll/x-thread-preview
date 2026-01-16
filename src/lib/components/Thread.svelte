<script lang="ts">
	import type { ThreadData } from '$lib/types';
	import Tweet from './Tweet.svelte';

	interface Props {
		thread: ThreadData;
	}

	let { thread }: Props = $props();
</script>

<div class="thread-container">
	<header class="thread-header">
		<h1>Thread Preview</h1>
		<span class="tweet-count">{thread.tweets.length} tweets</span>
	</header>

	<div class="thread">
		{#each thread.tweets as tweet, i}
			<Tweet
				{tweet}
				author={thread.author}
				isFirst={i === 0}
				isLast={i === thread.tweets.length - 1}
				index={i}
			/>
		{/each}
	</div>
</div>

<style>
	.thread-container {
		max-width: 600px;
		margin: 0 auto;
		border-left: 1px solid var(--x-border);
		border-right: 1px solid var(--x-border);
		min-height: 100vh;
	}

	.thread-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 16px;
		border-bottom: 1px solid var(--x-border);
		position: sticky;
		top: 0;
		background-color: rgba(0, 0, 0, 0.65);
		backdrop-filter: blur(12px);
		z-index: 10;
	}

	.thread-header h1 {
		font-size: 20px;
		font-weight: 700;
		margin: 0;
	}

	.tweet-count {
		color: var(--x-text-secondary);
		font-size: 14px;
	}

	.thread {
		/* Thread tweets */
	}
</style>
