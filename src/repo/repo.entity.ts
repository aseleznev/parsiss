import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Author } from '../author/author.entity';
import { Issue } from '../issue/issue.entity';

@Entity('repository')
export class Repo {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    name: string | null;

    @Column({ type: 'varchar', nullable: true })
    nameWithOwner: string | null;

    @Column({ type: 'varchar', nullable: true })
    url: string | null;

    @Column({ type: 'varchar', nullable: true })
    createdAt: string | null;

    @Column({ type: 'varchar', nullable: true })
    description: string | null;

    @Column({ type: 'varchar', nullable: true })
    descriptionHTML: string | null;

    @Column({ type: 'varchar', nullable: true })
    homepageUrl: string | null;

    @Column({ type: 'varchar', nullable: true })
    openGraphImageUrl: string | null;

    @ManyToOne(type => Author, { cascade: true })
    @JoinColumn()
    author: Author;

    @OneToMany(type => Issue, issue => issue.repo, { cascade: true })
    @JoinColumn()
    issues: Issue[];
}
