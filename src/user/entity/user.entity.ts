import { Min } from 'class-validator';
import { Revenue } from 'src/revenues/entities/revenue.entity';
import { ColumnNumericTransformer } from 'src/transformers/ColumnNumericTransformer';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  password_hash: string;

  @Column({ type: 'decimal', default: 0, scale: 2, precision: 10, transformer: new ColumnNumericTransformer() })
  @Min(0)
  balance: number;

  @OneToMany(() => Revenue, (revenue) => revenue.user, { cascade: true })
  revenues: Revenue[];
}
