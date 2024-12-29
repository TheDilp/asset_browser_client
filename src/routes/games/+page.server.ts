import type { AvailableGamesType, FoundryServiceEnvs, GameType } from '$lib/types/types';
import { db } from '$lib/server/util/db';
import { redirect } from '@sveltejs/kit';
import { FOUNDRY_SERVICE_ID, COOLIFY_TOKEN } from '$env/static/private';
import puppeteer from 'puppeteer';


async function fetchDynamicContent(url: string): Promise<string> {
	const browser = await puppeteer.launch({headless: true});
	const page = await browser.newPage();

	await page.goto(url); // Wait until the page is fully loaded
	await page.waitForSelector("div.form-fields.current-players span.count")
	// Extract the final HTML or specific content
	const spanContent = await page.$eval(
		'span.count',
		(el) => (el?.textContent || "")?.trim()
	);

	await browser.close();
	return spanContent;
}

export const actions = {
	changeWorld: async ({request, }) => {
		const data = await request.formData();
		const foundry_id = data.get("foundry_id") as AvailableGamesType;
		const res = await fetch(`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/envs`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${COOLIFY_TOKEN}`
			},
			body: JSON.stringify({
				"key": "FOUNDRY_WORLD",
				"value": foundry_id,
				"is_preview": false
			})
		});

		if (res.ok && res.status === 201) {
			 const restartRes = await fetch(`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/restart`, {
				headers: {
					Authorization: `Bearer ${COOLIFY_TOKEN}`
				},
			})
			console.info("RESTART", restartRes.ok, restartRes.status)
		}

		throw redirect(303, "/games")
	}
}


export async function load({ locals }) {
	if (!locals?.user?.id) {
		return redirect(303, '/login');
	}
	const data = await db
		.collection('games')
		.getFullList<GameType>({ filter: `owner_id = '${locals.user.id}' || owner_id = null` });
	try {
		const activeGameRes = await fetch(
			`https://admin.salaraan.com/api/v1/services/${FOUNDRY_SERVICE_ID}/envs`,
			{
				headers: {
					Authorization: `Bearer ${COOLIFY_TOKEN}`
				}
			}
		);
		const activeGameData = (await activeGameRes.json()) as FoundryServiceEnvs[];
		const currentWorld = activeGameData.find((e) => e.key === 'FOUNDRY_WORLD')?.value;
		const currentPlayerCount = await fetchDynamicContent("https://play.salaraan.com");
	return { data, currentWorld, currentPlayerCount: Number(currentPlayerCount || 0) };

	} catch (error) {
		console.info(error)
	}




	return { data, currentWorld: undefined, currentPlayerCount: 0};
}
