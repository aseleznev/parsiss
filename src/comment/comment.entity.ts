import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { strict } from 'assert';

@Entity('comment')
export class Comment {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string;

    @Column({ type: 'varchar', nullable: true })
    lastEditedAt: string;

    @Column({ type: 'varchar', nullable: true })
    updatedAt: string;

    @Column({ type: 'varchar', nullable: true })
    bodyHTML: string;

    @OneToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;
}
