/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AuthService } from './auth/auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  const authService = app.get(AuthService);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  const existAdmin = await authService['userRepository'].findOne({
    where: { username: 'admin' },
  });

  if (!existAdmin) {
    await authService.createAdminUser('admin', 'admin');
    console.log('Admin creado');
  }

  app.enableCors({
    origin: 'http://localhost:4200', // Fronted url
    methods: 'GET,HEAD,PUT,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // Swagger setup
  const config = new DocumentBuilder()
    .setTitle('API - Panel Administrativo')
    .setDescription(
      'Documentación de la API del proyecto (NestJS + Angular) - Alphi Web',
    )
    .setVersion('1.0')
    .addTag('Contact') // puedes agregar más tags luego
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(process.env.PORT ?? 3000);
  console.log(`Swagger listo en: http://localhost:3001/api/docs`);
}
bootstrap();
