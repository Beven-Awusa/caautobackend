import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // setup swagger documentation
  app.enableCors();
  app.enableShutdownHooks();
  app.setGlobalPrefix('api/caauto');
  const config = new DocumentBuilder()
    .setTitle('CA Auto Backend')
    .setDescription('CA Auto Backend API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/caauto/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
