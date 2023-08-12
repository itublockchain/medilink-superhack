import { Module } from '@nestjs/common';
import { EasController } from 'src/modules/eas/Eas.controller';
import { EasService } from 'src/modules/eas/Eas.service';

@Module({
  imports: [],
  controllers: [EasController],
  providers: [EasService],
})
export class EasModule {}
