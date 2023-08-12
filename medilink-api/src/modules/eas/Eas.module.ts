import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EasController } from 'src/modules/eas/Eas.controller';
import { EasService } from 'src/modules/eas/Eas.service';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [EasController],
  providers: [EasService],
})
export class EasModule {}
