import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('Nekopay API')
    .setDescription('The Nekopay API description')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => {
    const doc = SwaggerModule.createDocument(app, config);
    return cleanupOpenApiDoc(doc);
  };

  app.use(
    '/api',
    apiReference({
      theme: 'default',
      content: documentFactory(),
    }),
  );

  await app.listen(process.env.PORT || 3000, '0.0.0.0');
}
bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
