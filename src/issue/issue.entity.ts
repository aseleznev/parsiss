import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { Comment } from '../comment/comment.entity';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    title: string;

    @Column({ type: 'varchar', nullable: true })
    state: string;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string;

    @Column({ type: 'varchar', nullable: true })
    closedAt: string;

    @Column({ type: 'boolean', nullable: true })
    closed: boolean;

    @Column({ type: 'varchar', nullable: true })
    lastEditedAt: string;

    @OneToOne(type => Author)
    @JoinColumn()
    author: Author;

    @OneToMany(type => Comment, comment => comment.issue)
    @JoinColumn()
    comments: Comment[];
}
