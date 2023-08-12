import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { EasService } from 'src/modules/eas/Eas.service';

@ApiTags('EAS')
@Controller('eas')
export class EasController {
  constructor(private easService: EasService) {}
}
