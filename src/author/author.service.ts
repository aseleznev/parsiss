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

    async create(authorData: Author): Promise<Author> {
        return await this.authorRepository.create(authorData);
    }
}
