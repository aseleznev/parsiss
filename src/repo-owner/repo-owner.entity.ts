import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn } from 'typeorm';
import { Repo } from '../repo/repo.entity';

@Entity('repository_owner')
export class RepoOwner {
    @PrimaryColumn({ type: 'varchar', nullable: false })
    id: string;

    @Column({ type: 'varchar', nullable: true })
    login: string | null;

    @OneToMany(type => Repo, repo => repo.owner)
    @JoinColumn()
    repositories: Repo[];
}
