import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Chat } from 'src/entities/Chat.entity';
import { Message } from 'src/entities/Message.entity';
import { EasService } from 'src/modules/eas/Eas.service';
import { MessageController } from 'src/modules/messages/Message.controller';
import { MessageService } from 'src/modules/messages/Message.service';

@Module({
  imports: [TypeOrmModule.forFeature([Chat, Message])],
  controllers: [MessageController],
  providers: [MessageService, EasService],
})
export class MessageModule {}
