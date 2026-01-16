<script lang="ts">
	import '../app.css';
	import Thread from '$lib/components/Thread.svelte';
	import { defaultThread, type ThreadData } from '$lib/types';
	import { onMount } from 'svelte';

	let thread = $state<ThreadData>(defaultThread);
	let connected = $state(false);
	let error = $state<string | null>(null);

	onMount(() => {
		let eventSource: EventSource | null = null;

		const connect = () => {
			eventSource = new EventSource('/api/updates');

			eventSource.onopen = () => {
				connected = true;
				error = null;
				console.log('Connected to SSE');
			};

			eventSource.onmessage = (event) => {
				try {
					const data = JSON.parse(event.data) as ThreadData;
					thread = data;
				} catch (e) {
					console.error('Error parsing SSE data:', e);
				}
			};

			eventSource.onerror = () => {
				connected = false;
				error = 'Connection lost. Reconnecting...';
				eventSource?.close();

				// Reconnect after 2 seconds
				setTimeout(connect, 2000);
			};
		};

		connect();

		return () => {
			eventSource?.close();
		};
	});
</script>

<svelte:head>
	<title>Thread Preview</title>
</svelte:head>

<main>
	{#if error}
		<div class="status-bar error">
			{error}
		</div>
	{:else if connected}
		<div class="status-bar connected">
			● Live — Watching for changes
		</div>
	{:else}
		<div class="status-bar connecting">
			Connecting...
		</div>
	{/if}

	<Thread {thread} />
</main>

<style>
	main {
		min-height: 100vh;
	}

	.status-bar {
		position: fixed;
		bottom: 16px;
		right: 16px;
		padding: 8px 16px;
		border-radius: 20px;
		font-size: 13px;
		z-index: 100;
	}

	.status-bar.connected {
		background-color: rgba(0, 186, 124, 0.2);
		color: #00ba7c;
		border: 1px solid rgba(0, 186, 124, 0.3);
	}

	.status-bar.error {
		background-color: rgba(244, 33, 46, 0.2);
		color: #f4212e;
		border: 1px solid rgba(244, 33, 46, 0.3);
	}

	.status-bar.connecting {
		background-color: rgba(29, 155, 240, 0.2);
		color: #1d9bf0;
		border: 1px solid rgba(29, 155, 240, 0.3);
	}
</style>
