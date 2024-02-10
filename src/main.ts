import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AtGuard } from './common/guards';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors:true});
  app.useGlobalPipes(new ValidationPipe);
  await app.listen(3619);
}
bootstrap();
