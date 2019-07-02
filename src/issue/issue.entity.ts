import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { Comment } from '../comment/comment.entity';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    title: string | null;

    @Column({ type: 'varchar', nullable: true })
    state: string | null;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string | null;

    @Column({ type: 'varchar', nullable: true })
    closedAt: string | null;

    @Column({ type: 'boolean', nullable: true })
    closed: boolean | null;

    @Column({ type: 'varchar', nullable: true })
    lastEditedAt: string | null;

    @Column({ type: 'int', nullable: true })
    commentsCount: number | null;

    @ManyToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;

    @OneToMany(type => Comment, comment => comment.issue, { cascade: true })
    @JoinColumn()
    comments: Comment[];
}
