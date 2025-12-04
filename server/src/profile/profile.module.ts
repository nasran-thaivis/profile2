import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [ProfileController],
  providers: [ProfileService],
})
export class ProfileModule {}

