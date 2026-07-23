import PocketBase from 'pocketbase';

export const db = new PocketBase(import.meta.env.DATABASE_URL).autoCancellation(false);
