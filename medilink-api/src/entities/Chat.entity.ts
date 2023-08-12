import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Chat {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column()
  user_1: string;

  @Column()
  user_2: string;
}
