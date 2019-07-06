import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from 'nestjs-config';
import { IssueModule } from './issue/issue.module';
import { AuthorModule } from './author/author.module';
import { CommentModule } from './comment/comment.module';
import { RepoModule } from './repo/repoModule';
import { RepoService } from './repo/repo.service';
import { RepoService } from './repo/repo.service';
import { RepositoryOwnerModule } from './repository-owner/repository-owner.module';
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
    RepositoryOwnerModule
  ],
  controllers: [AppController],
  providers: [AppService, RepoService]
})
export class AppModule {}
