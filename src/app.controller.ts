import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { InjectConfig } from 'nestjs-config';

@Controller()
export class AppController {
    constructor(@InjectConfig() private readonly config, private readonly appService: AppService) {
        this.config = config;
    }

    @Get()
    getHello() {
        return 'Hello World!';
    }

    @Get('parse')
    async parse(@Res() res): Promise<string> {
        return await this.appService.parse().then(() => res.json('done'));
    }

    @Get('parseRepos')
    async parseRepos(@Res() res): Promise<string> {
        return await this.appService.parseReposRest().then((result) => res.json(result));
    }

    @Get('translate')
    async translate(@Res() res): Promise<string> {
        return await this.appService.translate().then(() => res.json('done'));
    }

    @Get('test')
    test() {}
}
