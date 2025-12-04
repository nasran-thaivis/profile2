import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { FileUploadModule } from '../file-upload/file-upload.module';

@Module({
  imports: [FileUploadModule],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}

