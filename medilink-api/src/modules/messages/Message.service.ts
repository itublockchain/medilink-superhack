import { SchemaEncoder } from '@ethereum-attestation-service/eas-sdk';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration, OpenAIApi } from 'openai';
import { Chat } from 'src/entities/Chat.entity';
import { Message } from 'src/entities/Message.entity';
import { EasService } from 'src/modules/eas/Eas.service';
import { SendMessageDto } from 'src/modules/messages/Message.dto';
import { Environment } from 'src/utils/Environment';
import { Repository } from 'typeorm';

@Injectable()
export class MessageService {
  openAI: OpenAIApi;

  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,

    @InjectRepository(Chat) private chatRepository: Repository<Chat>,

    private easService: EasService,
  ) {
    const configuration = new Configuration({
      apiKey: Environment.OPEN_AI_KEY,
    });
    this.openAI = new OpenAIApi(configuration);
  }

  public async genSendMessage(messageDto: SendMessageDto): Promise<Message> {
    if (messageDto.chat_id === 0) {
      // Ai
      const newMessageEntity = this.messageRepository.create({
        attachmentId: messageDto.attachment_id,
        chat_id: 0,
        receiver: 'bot',
        sender: messageDto.sender,
        message: messageDto.message,
      });

      if (messageDto.attachment_id != null) {
        const attachment = await this.easService.genNullableAttestation(
          messageDto.attachment_id,
        );
        const data = attachment.attestation.data;

        const schemaEncoder = new SchemaEncoder('string data');
        const encoded = schemaEncoder.decodeData(data);
        const value = encoded[0].value.value;
        const chatCompletion = await this.openAI.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: `These are my average medical data as JSON:

           ${value}

             Can you give me a two sentence health status of me based on the data and tell
             me if something wrong with my health?`,
            },
          ],
        });

        const content = chatCompletion.data.choices[0].message.content;

        const newBotMessageEntity = this.messageRepository.create({
          attachmentId: null,
          chat_id: 0,
          receiver: messageDto.sender,
          sender: 'bot',
          message: content,
        });
        const result = await this.messageRepository.save([
          newMessageEntity,
          newBotMessageEntity,
        ]);
        return result[1];
      } else {
        const chatCompletion = await this.openAI.createChatCompletion({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: messageDto.message }],
        });
        const content = chatCompletion.data.choices[0].message.content;
        const newBotMessageEntity = this.messageRepository.create({
          attachmentId: null,
          chat_id: 0,
          receiver: messageDto.sender,
          sender: 'bot',
          message: content,
        });
        const result = await this.messageRepository.save([
          newMessageEntity,
          newBotMessageEntity,
        ]);
        return result[1];
      }
    } else {
      let chatId: number | null = null;

      if (messageDto.chat_id == null) {
        // New Message
        const newChatEntity = this.chatRepository.create({
          user_1: messageDto.sender,
          user_2: messageDto.receiver,
        });
        const newChat = await this.chatRepository.save(newChatEntity);
        chatId = newChat.id;
      } else {
        const chat = await this.chatRepository.findOne({
          where: {
            id: messageDto.chat_id,
          },
        });
        chatId = chat.id;
      }

      const newMessageEntity = this.messageRepository.create({
        attachmentId: messageDto.attachment_id,
        chat_id: chatId,
        receiver: messageDto.receiver,
        sender: messageDto.sender,
      });
      const message = await this.chatRepository.save(newMessageEntity);
      return message;
    }
  }
}
