import { ApiProperty } from '@nestjs/swagger';

export class SendMessageDto {
  @ApiProperty()
  message: string;

  @ApiProperty()
  attachment_id: string;

  @ApiProperty()
  chat_id?: number;

  @ApiProperty()
  sender: string;

  @ApiProperty()
  receiver: string;
}
