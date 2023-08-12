import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Message } from 'src/entities/Message.entity';
import { SendMessageDto } from 'src/modules/messages/Message.dto';

import { MessageService } from 'src/modules/messages/Message.service';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('Message')
@Controller('message')
export class MessageController {
  constructor(private messageService: MessageService) {}

  @DefaultApiOperation('Send message')
  @Post()
  public async genSendMessage(@Body() body: SendMessageDto): Promise<Message> {
    return await this.messageService.genSendMessage(body);
  }
}
