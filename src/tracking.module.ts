import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ButtonTrackingController,
  FormFieldTrackingController,
  FormPageTrackingController,
  ScreenTrackingController,
} from './tracking.controller';
import {
  ButtonEvent,
  FormFieldEvent,
  FormPageEvent,
  ScreenEvent,
} from './tracking.entity';
import {
  ButtonTrackingService,
  FormFieldTrackingService,
  FormPageTrackingService,
  ScreenTrackingService,
} from './tracking.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ButtonEvent,
      FormFieldEvent,
      FormPageEvent,
      ScreenEvent,
    ]),
  ],
  controllers: [
    ButtonTrackingController,
    FormFieldTrackingController,
    FormPageTrackingController,
    ScreenTrackingController,
  ],
  providers: [
    ButtonTrackingService,
    FormFieldTrackingService,
    FormPageTrackingService,
    ScreenTrackingService,
  ],
})
export class TrackingModule {}
