import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('issue')
export class Issue {
    @PrimaryColumn({ type: 'varchar' })
    id: number;

    @Column()
    title: string;

    @Column()
    state: string;
}
