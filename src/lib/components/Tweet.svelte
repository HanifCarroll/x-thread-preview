<script lang="ts">
	import type { Author, Tweet } from '$lib/types';

	interface Props {
		tweet: Tweet;
		author: Author;
		isFirst?: boolean;
		isLast?: boolean;
		index: number;
	}

	let { tweet, author, isFirst = false, isLast = false, index }: Props = $props();

	const charCount = $derived(tweet.text.length);
	const isOverLimit = $derived(charCount > 280);
</script>

<article class="tweet" class:first={isFirst} class:last={isLast}>
	<!-- Thread connector line -->
	{#if !isFirst}
		<div class="connector-top"></div>
	{/if}

	<div class="tweet-content">
		<!-- Avatar column -->
		<div class="avatar-column">
			<img
				src={author.avatar || '/avatar.jpg'}
				alt={author.name}
				class="avatar"
			/>
			{#if !isLast}
				<div class="connector-line"></div>
			{/if}
		</div>

		<!-- Main content -->
		<div class="main-column">
			<!-- Header -->
			<div class="header">
				<span class="name">{author.name}</span>
				<span class="handle">@{author.handle}</span>
				<span class="dot">·</span>
				<span class="tweet-number">Tweet {index + 1}</span>
			</div>

			<!-- Tweet text -->
			<div class="text">{tweet.text}</div>

			<!-- Image if present -->
			{#if tweet.image}
				<div class="image-container">
					<img src={tweet.image} alt="Tweet attachment" class="tweet-image" />
				</div>
			{/if}

			<!-- Character count -->
			<div class="footer">
				<span class="char-count" class:over-limit={isOverLimit}>
					{charCount}/280
				</span>
			</div>
		</div>
	</div>
</article>

<style>
	.tweet {
		position: relative;
		padding: 12px 16px;
		border-bottom: 1px solid var(--x-border);
	}

	.tweet:hover {
		background-color: var(--x-hover);
	}

	.tweet-content {
		display: flex;
		gap: 12px;
	}

	.avatar-column {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 40px;
		flex-shrink: 0;
	}

	.avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		object-fit: cover;
	}

	.connector-line {
		width: 2px;
		flex-grow: 1;
		background-color: var(--x-border);
		margin-top: 4px;
		min-height: 20px;
	}

	.main-column {
		flex-grow: 1;
		min-width: 0;
	}

	.header {
		display: flex;
		align-items: center;
		gap: 4px;
		margin-bottom: 4px;
	}

	.name {
		font-weight: 700;
		color: var(--x-text);
	}

	.handle {
		color: var(--x-text-secondary);
	}

	.dot {
		color: var(--x-text-secondary);
	}

	.tweet-number {
		color: var(--x-blue);
		font-size: 13px;
	}

	.text {
		white-space: pre-wrap;
		word-wrap: break-word;
		line-height: 1.4;
		font-size: 15px;
	}

	.image-container {
		margin-top: 12px;
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid var(--x-border);
	}

	.tweet-image {
		width: 100%;
		height: auto;
		display: block;
	}

	.footer {
		margin-top: 12px;
		display: flex;
		justify-content: flex-end;
	}

	.char-count {
		font-size: 13px;
		color: var(--x-text-secondary);
	}

	.char-count.over-limit {
		color: #f4212e;
		font-weight: 600;
	}
</style>
