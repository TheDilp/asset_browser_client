import { DO_SPACES_ENDPOINT, DO_SPACES_KEY, DO_SPACES_SECRET } from '$env/static/private';
import { S3 } from '@aws-sdk/client-s3';

export const s3Client = new S3({
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	endpoint: DO_SPACES_ENDPOINT,
	region: 'us-east-1',
	credentials: {
		accessKeyId: DO_SPACES_KEY,
		secretAccessKey: DO_SPACES_SECRET
	}
});
