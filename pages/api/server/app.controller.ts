import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { TempusReadGuard } from './auth/azure-ad-strategy';

@Controller('randomNumber')
export class AppController {
  @Get()
  @UseGuards(TempusReadGuard)
  randomNumber() {
    return Math.random() * 100;
  }

  @Get('/:number')
  async findOne(@Param('number') param: string) {
    return { param };
  }
}
