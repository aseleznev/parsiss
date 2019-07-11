import { Injectable } from '@nestjs/common';
import { Issue } from './issue.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, getRepository, Repository } from 'typeorm';

@Injectable()
export class IssueService {
    constructor(@InjectRepository(Issue) private readonly issueRepository: Repository<Issue>) {}

    async save(issues: Issue[]): Promise<Issue[]> {
        return await this.issueRepository.save(issues);
    }

    async findAll(): Promise<Issue[]> {
        return await this.issueRepository.find();
    }

    async findUntranslated(take: number): Promise<Issue[]> {
        //return await this.issueRepository.find({ take, where: { translated: false }, relations: ['comments'] });
        return await this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndMapMany('issue.comments', 'comment', 'comment.bodyHTMLLength < 5000')
            .where('issue.translated = :translated', { translated: false })
            .take(take)
            .getMany();
    }

    async create(issue: Issue): Promise<Issue> {
        return await this.issueRepository.create(issue);
    }
}
