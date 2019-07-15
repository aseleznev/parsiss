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

    async findUntranslated(take: number): Promise<Issue[]> {
        //return await this.issueRepository.find({ take, where: { translated: false }, relations: ['comments'] });
        return await this.issueRepository
            .createQueryBuilder('issue')
            .leftJoinAndSelect('issue.comments', 'comment')
            .where('issue.translated = :translated', { translated: false })
            .andWhere('comment.bodyHTMLLength < 4000')
            .take(take)
            .getMany();
    }

    async create(issue: Issue): Promise<Issue> {
        return await this.issueRepository.create(issue);
    }
}
