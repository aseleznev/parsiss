import { Column, Entity, PrimaryColumn } from 'typeorm';

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

    public returnGhost(){
        const ghost = new Author();
        ghost.login = 'Ghost';
        ghost.typename = 'User';
        ghost.resourcePath = '/Ghost';
        ghost.url = 'https://github.com/ghost';
        ghost.avatarUrl = 'https://avatars1.githubusercontent.com/u/10137?s=400&v=4';
        return ghost;
    }
}
