import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import cookieParser from 'cookie-parser';
import { cleanupOpenApiDoc } from 'nestjs-zod';
import { AllExceptionsFilter } from './_core/filters/all-exceptions.filter';
import { TransformInterceptor } from './_core/interceptors/transform.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  // Apply Global Response Wrapper
  app.useGlobalInterceptors(new TransformInterceptor());

  // Apply Global Error Formatting
  const httpAdapter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

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
