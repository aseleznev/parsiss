import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { Comment } from '../comment/comment.entity';
import { Repo } from '../repo/repo.entity';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    title: string | null;

    @Column({ type: 'varchar', nullable: true })
    titleRu: string | null;

    @Column({ type: 'varchar', nullable: true })
    bodyHTML: string | null;

    @Column({ type: 'varchar', nullable: true })
    bodyHTMLRu: string | null;

    @Column({ type: 'varchar', nullable: true })
    state: string | null;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string | null;

    @Column({ type: 'varchar', nullable: true })
    closedAt: string | null;

    @Column({ type: 'boolean', nullable: true })
    closed: boolean | null;

    @Column({ type: 'boolean', nullable: true, default: false })
    translated: boolean | null;

    @Column({ type: 'varchar', nullable: true })
    lastEditedAt: string | null;

    @Column({ type: 'int', nullable: true })
    commentsCount: number | null;

    @ManyToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;

    @ManyToOne(type => Repo, { cascade: true })
    @JoinColumn()
    repo: Repo;

    @OneToMany(type => Comment, comment => comment.issue, { cascade: true })
    @JoinColumn()
    comments: Comment[];
}
