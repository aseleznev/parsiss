import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Issue } from '../issue/issue.entity';
import { RepoOwner } from '../repo-owner/repo-owner.entity';

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

    @ManyToOne(type => RepoOwner, { cascade: true })
    @JoinColumn()
    owner: RepoOwner;

    @OneToMany(type => Issue, issue => issue.repo)
    @JoinColumn()
    issues: Issue[];
}
