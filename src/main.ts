import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';
import { env } from 'process';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  app.useGlobalPipes(new ValidationPipe);
  console.log("App is listening on port: ", env.APP_PORT);
  await app.listen(env.APP_PORT);
}

bootstrap();



