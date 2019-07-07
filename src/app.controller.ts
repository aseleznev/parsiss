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
        return await this.appService.parse().then(data => res.json(data));
    }

    @Get('translate')
    async translate(@Res() res): Promise<string> {
        return await this.appService.translate().then(data => res.json(data));
    }

    @Get('test')
    test() {
        const translate = require('@vitalets/google-translate-api');

        translate('Ik spreek Engels', { to: 'en' })
            .then(res => {
                console.log(res.text);
                //=> I speak English
                console.log(res.from.language.iso);
                //=> nl
            })
            .catch(err => {
                console.error(err);
            });
    }
}
