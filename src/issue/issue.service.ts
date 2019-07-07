import { Injectable } from '@nestjs/common';
import { Issue } from './issue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class IssueService {
    constructor(@InjectRepository(Issue) private readonly issueRepository: Repository<Issue>) {}

    async save(issues: Issue[]): Promise<Issue[]> {
        return await this.issueRepository.save(issues);
    }

    async findAll(): Promise<Issue[]> {
        return await this.issueRepository.find();
    }

    async findTenUntranslated(): Promise<Issue[]> {
        return await this.issueRepository.find({ take: 10, where: { translated: null } });
    }

    async create(issue: Issue): Promise<Issue> {
        return await this.issueRepository.create(issue);
    }
}
