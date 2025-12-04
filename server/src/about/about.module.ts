import { Module } from '@nestjs/common';
import { AboutController } from './about.controller';
import { AboutService } from './about.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}

