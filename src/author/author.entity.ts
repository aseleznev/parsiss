import { Column, Entity, JoinColumn, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Issue } from '../issue/issue.entity';

@Entity('author')
export class Author {

    @PrimaryColumn({ unique: true, nullable: false })
    login: string;

    @Column({ type: 'varchar', nullable: true })
    typename: string;

    @Column({ type: 'varchar', nullable: true })
    resourcePath: string;

    @Column({ type: 'varchar', nullable: true })
    url: string;

    @Column({ type: 'varchar', nullable: true })
    avatarUrl: string;

    @OneToMany(type => Issue, issue => issue.author)
    @JoinColumn()
    issues: Issue[];
}
