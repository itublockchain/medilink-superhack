import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';
import { Chat } from 'src/entities/Chat.entity';
import { Message } from 'src/entities/Message.entity';
import { Environment } from 'src/utils/Environment';

config();

export const CONFIG: Config = {
  MYSQL: {
    type: 'mysql',
    host: Environment.DB_HOST,
    port: Environment.DB_PORT,
    username: Environment.DB_USER,
    password: Environment.DB_PASSWORD,
    database: Environment.DB_NAME,
    entities: [Message, Chat],
    synchronize: true,
  } as TypeOrmModuleOptions,
  PORT: Environment.PORT,
  APP_CORS: Environment.APP_CORS,
  APP_NAME: 'Medilink',
  AUTH_MESSAGE: 'Authorize Medilink',
};

type Config = {
  MYSQL: TypeOrmModuleOptions;
  PORT: number;
  APP_CORS: string;
  APP_NAME: string;
  AUTH_MESSAGE: string;
};
