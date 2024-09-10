import PocketBase from 'pocketbase';
// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
// and what to do when importing types
declare global {
	declare namespace App {
		interface Locals {
			db: PocketBase;
			user: { id: string } | undefined;
		}
		// interface PageData {}
		// interface Error {}
		// interface Platform {}
	}
}
/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />
