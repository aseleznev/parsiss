import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
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

    @ManyToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;

    @OneToMany(type => Comment, comment => comment.issue)
    @JoinColumn()
    comments: Comment[];
}
