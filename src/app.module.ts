import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactModule } from './contact/contact.module';
import { AuthModule } from './auth/auth.module';
import { ClientModule } from './client/client.module';
import { TeamModule } from './team/team.module';
import { MemberModule } from './member/member.module';
import { ProjectModule } from './project/project.module';
import { TaskModule } from './task/task.module';
import { PaymentModule } from './payment/payment.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { InstructionalDesignerModule } from './instructional-designer/instructional-designer.module';
import { PdfService } from './pdf/pdf.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true, // Quitar en producción.
      }),
    }),

    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'single',
        url: config.get<string>('REDIS_URL') || 'redis://localhost:6379',
      }),
    }),

    ContactModule,
    AuthModule,
    ClientModule,
    TeamModule,
    MemberModule,
    ProjectModule,
    TaskModule,
    PaymentModule,
    DashboardModule,
    InstructionalDesignerModule,
  ],
  controllers: [AppController],
  providers: [AppService, PdfService],
})
export class AppModule {}
