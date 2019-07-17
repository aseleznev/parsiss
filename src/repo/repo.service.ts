import { Injectable } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { Repo } from './repo.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RepoService {
    constructor(@InjectRepository(Repo) private readonly repoRepository: Repository<Repo>) {}

    async save(repos: Repo[]): Promise<Repo[]> {
        return await this.repoRepository.save(repos);
    }

    async findAll(): Promise<Repo[]> {
        return await this.repoRepository.find();
    }

    async create(repo: DeepPartial<Repo>): Promise<Repo> {
        return await this.repoRepository.create(repo);
    }
}
