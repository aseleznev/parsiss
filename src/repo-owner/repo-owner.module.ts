import { Module } from '@nestjs/common';
import { RepoOwnerService } from './repo-owner.service';
import { RepoOwner } from './repo-owner.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  providers: [RepoOwnerService],
  imports: [TypeOrmModule.forFeature([RepoOwner])],
  exports: [RepoOwnerService],

})
export class RepoOwnerModule {}
