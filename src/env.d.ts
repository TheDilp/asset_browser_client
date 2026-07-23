/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

import type PocketBase from 'pocketbase';

declare global {
	namespace App {
		interface Locals {
			db: PocketBase;
			user: { id: string } | undefined;
		}
	}
}
