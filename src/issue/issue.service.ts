import { Injectable } from '@nestjs/common';
import { Issue } from './issue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IssueService {
    constructor(@InjectRepository(Issue) private readonly issueRepository: Repository<Issue>) {}

    async save(issue: Issue): Promise<Issue> {
        return await this.issueRepository.save(issue);
    }

    async findAll(): Promise<Issue[]> {
        return await this.issueRepository.find();
    }
}
