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

}
