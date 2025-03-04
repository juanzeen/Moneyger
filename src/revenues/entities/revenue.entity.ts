import { IsOptional } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Revenue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  value: number;

  @Column('text', { array: true, nullable: true })
  @IsOptional()
  tags?: string[];

  @ManyToOne(() => User, (user) => user.revenues, { onDelete: 'CASCADE' })
  user: User
}
