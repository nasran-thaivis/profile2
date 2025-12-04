import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { ProfileModule } from './profile/profile.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { EducationModule } from './education/education.module';
import { AboutModule } from './about/about.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    FileUploadModule,
    ProfileModule,
    PortfolioModule,
    EducationModule,
    AboutModule,
    ContactModule,
  ],
})
export class AppModule {}

