import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { IssueModule } from './issue/issue.module';
import { AuthorModule } from './author/author.module';
import { CommentModule } from './comment/comment.module';
import { RepoModule } from './repo/repo.module';
import { RepoOwnerModule } from './repo-owner/repo-owner.module';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.load(path.resolve(__dirname, 'config', '**/!(*.d).{ts,js}')),
    TypeOrmModule.forRootAsync({
      useFactory: async (config: ConfigService) => config.get('database'),
      inject: [ConfigService]
    }),
    IssueModule,
    AuthorModule,
    CommentModule,
    RepoModule,
    RepoOwnerModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
