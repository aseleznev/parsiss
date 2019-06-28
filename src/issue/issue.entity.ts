import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';

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

    @OneToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;
}
