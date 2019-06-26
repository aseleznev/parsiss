import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar' })
    id: number;

    @Column({ type: 'varchar' })
    title: string;

    @Column({ type: 'varchar' })
    state: string;

    @Column({ type: 'varchar' })
    createdAt: string;

    @Column({ type: 'varchar' })
    closedAt: string;

    @Column({ type: 'boolean' })
    closed: boolean;

    @Column({ type: 'varchar' })
    lastEditedAt: string;

    @OneToOne(type => Author)
    @JoinColumn()
    author: Author;
}
