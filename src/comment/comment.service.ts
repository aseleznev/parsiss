import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comment.entity';

@Injectable()
export class CommentService {
    constructor(@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>) {}

    async create(comment: Comment): Promise<Comment> {
        return await this.commentRepository.create(comment);
    }
}
