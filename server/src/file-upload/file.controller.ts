import { Controller, Get, Param, Res, NotFoundException, Req, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { FileUploadService } from './file-upload.service';

@Controller('files')
export class FileController {
  private readonly logger = new Logger(FileController.name);

  constructor(private fileUploadService: FileUploadService) {}

  @Get('*')
  async getFile(@Req() req: Request, @Res() res: Response) {
    try {
      // Extract path from request URL
      // Remove '/files' prefix and leading slash
      const fullPath = req.url;
      const pathMatch = fullPath.match(/^\/files\/(.+)$/);
      
      if (!pathMatch) {
        this.logger.warn(`Invalid file path: ${fullPath}`);
        throw new NotFoundException('Invalid file path');
      }
      
      // Decode URL-encoded path
      const cleanPath = decodeURIComponent(pathMatch[1]);
      this.logger.debug(`Requesting file: ${cleanPath}`);
      
      const { stream, contentType } = await this.fileUploadService.getFileStream(cleanPath);
      
      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache for 1 year
      
      stream.on('error', (error) => {
        this.logger.error(`Stream error for ${cleanPath}:`, error);
        if (!res.headersSent) {
          res.status(500).send('Error streaming file');
        }
      });
      
      stream.pipe(res);
    } catch (error) {
      this.logger.error(`Error getting file:`, error);
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('File not found');
    }
  }
}

