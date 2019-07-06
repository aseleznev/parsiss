import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from 'nestjs-config';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    await app.listen(ConfigService.get('app.port'));
    console.log(ConfigService.get('app').isProduction());
}
bootstrap();
