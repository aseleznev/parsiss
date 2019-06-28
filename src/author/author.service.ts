import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Author } from './author.entity';

@Injectable()
export class AuthorService {
    constructor(@InjectRepository(Author) private readonly authorRepository: Repository<Author>) {}

    async save(author: Author): Promise<Author> {
        return await this.authorRepository.save(author);
    }

    async findAll(): Promise<Author[]> {
        return await this.authorRepository.find();
    }

    async findOne(login: string): Promise<Author> {
        return await this.authorRepository.findOne(login);
    }

    async create(author: Author): Promise<Author> {
        return await this.authorRepository.create(author);
    }

    async preload(author: Author): Promise<Author | undefined> {
        return await this.authorRepository.preload(author);
    }
}
