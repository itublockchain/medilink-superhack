import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CONFIG } from 'src/config';
import { EasModule } from 'src/modules/eas/Eas.module';
import { FaucetModule } from 'src/modules/faucet/Faucet.module';
import { TransactionModule } from 'src/modules/transaction/Transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    /* REMOVE COMMENTS FOR DB CONNECTION */
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => {
        return CONFIG.MYSQL;
      },
    }),
    /* REMOVE COMMENTS FOR DB CONNECTION */

    EasModule,
    TransactionModule,
    FaucetModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
