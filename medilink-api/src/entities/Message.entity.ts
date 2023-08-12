import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Messages {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  chat_id: number;

  @ApiProperty()
  @Column()
  sender: string;

  @ApiProperty()
  @Column()
  receiver: string;

  @ApiProperty()
  @Column({ nullable: true, default: null })
  attachmentId: number | null;
}
