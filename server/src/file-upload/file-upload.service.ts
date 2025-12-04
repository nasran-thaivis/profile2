import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import * as crypto from 'crypto';
import * as https from 'https';

@Injectable()
export class FileUploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private endpoint: string;
  private region: string;

  constructor(private configService: ConfigService) {
    this.endpoint = this.configService.get<string>('DO_SPACES_ENDPOINT');
    this.region = this.configService.get<string>('DO_SPACES_REGION');
    this.bucketName = this.configService.get<string>('DO_SPACES_BUCKET');
    
    // For virtual-hosted style, endpoint should NOT include bucket name
    // If endpoint contains bucket name, extract just the regional endpoint
    let cleanEndpoint = this.endpoint?.replace(/\/$/, '');
    if (cleanEndpoint) {
      // Remove bucket name from endpoint if present
      // e.g., https://internship.sgp1.digitaloceanspaces.com -> https://sgp1.digitaloceanspaces.com
      cleanEndpoint = cleanEndpoint.replace(/https?:\/\/[^.]+\./, 'https://');
    }
    if (!cleanEndpoint) {
      cleanEndpoint = `https://${this.region}.digitaloceanspaces.com`;
    }
    
    // Create HTTPS agent that accepts the certificate
    const httpsAgent = new https.Agent({
      rejectUnauthorized: false, // Accept self-signed or mismatched certificates
    });
    
    this.s3Client = new S3Client({
      endpoint: cleanEndpoint,
      region: this.region,
      credentials: {
        accessKeyId: this.configService.get<string>('DO_SPACES_KEY'),
        secretAccessKey: this.configService.get<string>('DO_SPACES_SECRET'),
      },
      forcePathStyle: false, // DigitalOcean Spaces uses virtual-hosted style
      requestHandler: {
        httpsAgent,
      } as any,
    });
  }

  async uploadFile(file: Express.Multer.File, key: string): Promise<string> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueKey = `${key}-${crypto.randomBytes(16).toString('hex')}.${fileExtension}`;

    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: uniqueKey,
      Body: file.buffer,
      ContentType: file.mimetype,
      ACL: 'public-read',
    });

    await this.s3Client.send(command);

    // Return public URL for DigitalOcean Spaces
    // Format: https://{bucket}.{region}.digitaloceanspaces.com/{key}
    return `https://${this.bucketName}.${this.region}.digitaloceanspaces.com/${uniqueKey}`;
  }
}

