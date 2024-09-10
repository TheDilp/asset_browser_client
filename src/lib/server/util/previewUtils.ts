import { DO_SPACES_CDN_ENDPOINT, DO_SPACES_NAME } from '$env/static/private';

export function preview(url: string) {
	return `https://${DO_SPACES_NAME}.${DO_SPACES_CDN_ENDPOINT}/${url}`;
}
