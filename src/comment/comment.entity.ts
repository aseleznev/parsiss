import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { Issue } from '../issue/issue.entity';

@Entity('comment')
export class Comment {
    @PrimaryColumn({ type: 'varchar' })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string;

    @Column({
        type: 'varchar',
        nullable: true
    })
    lastEditedAt: string;

    @Column({ type: 'varchar', nullable: true })
    updatedAt: string;

    @Column({ type: 'varchar', nullable: true })
    bodyHTML: string;

    @ManyToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;

    @ManyToOne(type => Issue)
    @JoinColumn()
    issue: Issue;
}
