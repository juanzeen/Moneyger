import { Revenue } from 'src/revenues/entities/revenue.entity';
import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password_hash: string;

  @Column({default: 0})
  balance: number;

  @OneToMany(() => Revenue, (revenue) => revenue.user, { cascade: true })
  revenues: Revenue[];
}
