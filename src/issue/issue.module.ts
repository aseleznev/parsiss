import { Module } from '@nestjs/common';
import { IssueService } from './issue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './issue.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Issue])],
  providers: [IssueService],
  exports: [IssueService]
})
export class IssueModule {}
