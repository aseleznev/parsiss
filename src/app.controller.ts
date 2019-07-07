import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConfig } from 'nestjs-config';
import { Issue } from './issue/issue.entity';


@Controller()
export class AppController {
  constructor(@InjectConfig() private readonly config, private readonly appService: AppService) {
    this.config = config;
  }

  @Get()
  getHello(){
    return "Hello World!";
  }

  @Get('parse')
  async parseIssues(@Res() res): Promise<Issue[]> {
    return await this.appService.parse().then(data => res.json(data));
  }
}
