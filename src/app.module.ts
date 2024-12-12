import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ButtonEvent,
  FormFieldEvent,
  FormPageEvent,
  ScreenEvent,
} from './tracking.entity';
import { TrackingModule } from './tracking.module';

@Module({
  imports: [
    TrackingModule,
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.sqlite',
      entities: [ButtonEvent, FormFieldEvent, FormPageEvent, ScreenEvent],
      synchronize: true,
    }),
  ],
})
export class AppModule {}
