import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AtGuard } from './common/guards';
import { env } from 'process';


async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('Prom Backend')
    .setDescription('The Prom API Description')
    .setVersion('1.0')
    .addTag('prom')
    .addBearerAuth()
    .build()
;

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);

  await app.listen(env.APP_PORT);
}

bootstrap();
