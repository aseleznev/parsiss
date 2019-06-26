import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('author')
export class Author {
    @PrimaryColumn({ type: 'varchar' })
    login: string;

    @Column({ type: 'varchar' })
    typename: string;

    @Column({ type: 'varchar' })
    resourcePath: string;

    @Column({ type: 'varchar' })
    url: string;

    @Column({ type: 'varchar' })
    avatarUrl: string;
}
