import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([Comment])],
    providers: [CommentService],
    exports: [CommentService]
})
export class CommentModule {}
