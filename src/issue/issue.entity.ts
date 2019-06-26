import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar' })
    id: number;

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

    @ManyToOne(type => Author, author => author.issues)
    author: Author;
}
