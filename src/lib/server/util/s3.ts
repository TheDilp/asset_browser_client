import { S3 } from '@aws-sdk/client-s3';

export const s3Client = new S3({
	forcePathStyle: false, // Configures to use subdomain/virtual calling format.
	endpoint: import.meta.env.DO_SPACES_ENDPOINT,
	region: 'us-east-1',
	credentials: {
		accessKeyId: import.meta.env.DO_SPACES_KEY,
		secretAccessKey: import.meta.env.DO_SPACES_SECRET
	}
});
