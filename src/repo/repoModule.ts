import { Module } from '@nestjs/common';
import { RepoService } from './repo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repo } from './repo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Repo])],
  providers: [RepoService],
  exports: [RepoService],
})

export class RepoModule {}
