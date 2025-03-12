import { IsOptional, IsString } from 'class-validator';
import { User } from 'src/user/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ColumnNumericTransformer } from '../../transformers/ColumnNumericTransformer';

@Entity()
export class Revenue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', scale: 2, precision: 10, transformer: new ColumnNumericTransformer() })
  value: number;

  @Column('text', { array: true, nullable: true })
  @IsOptional()
  tags?: string[];

  @Column()
  @IsString()
  type: "in" | "out"

  @ManyToOne(() => User, (user) => user.revenues, { onDelete: 'CASCADE' })
  user: User;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;
}
