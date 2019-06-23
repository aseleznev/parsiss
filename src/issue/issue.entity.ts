import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('issue')
export class Issue {

  @PrimaryColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  state: string;

}