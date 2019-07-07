import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RepoOwner } from './repo-owner.entity';

@Injectable()
export class RepoOwnerService {
    constructor(@InjectRepository(RepoOwner) private readonly repoOwnerRepository: Repository<RepoOwner>) {}

    async findAll(): Promise<RepoOwner[]> {
        return await this.repoOwnerRepository.find();
    }

    async create(repoOwner: RepoOwner): Promise<RepoOwner> {
        return await this.repoOwnerRepository.create(repoOwner);
    }
}
