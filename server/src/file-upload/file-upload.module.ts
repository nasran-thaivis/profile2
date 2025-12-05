import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileUploadService],
  exports: [FileUploadService],
})
export class FileUploadModule {}

