export function preview(url: string) {
	return `https://${import.meta.env.DO_SPACES_NAME}.${import.meta.env.DO_SPACES_CDN_ENDPOINT}/${url}`;
}
