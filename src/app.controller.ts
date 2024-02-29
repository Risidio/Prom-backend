import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { PublicDecorator } from './common/decorators';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


}
