import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as request from 'supertest';
import { ButtonEventDto } from '../src/tracking.dto';
import {
  ButtonEvent,
  FormFieldEvent,
  FormPageEvent,
  ScreenEvent,
} from '../src/tracking.entity';
import { TrackingModule } from '../src/tracking.module';
import { ButtonTrackingService } from '../src/tracking.service';

describe('ButtonTrackingController (e2e)', () => {
  let app: INestApplication;
  let buttonTrackingService: ButtonTrackingService;

  const createButtonEventDto: ButtonEventDto = {
    user: 1,
    session: 10,
    timestamp: Date.now(),
    url: '/help/',
    button_text: 'Ver mais perguntas frequentes',
    button_id: 'more_faq',
    container_name: 'faq_container',
  };

  beforeEach(async () => {
    const entities = [ButtonEvent, FormFieldEvent, FormPageEvent, ScreenEvent];

    const dbOptions: TypeOrmModuleOptions = {
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities,
      synchronize: true,
    };

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TrackingModule,
        TypeOrmModule.forRoot(dbOptions),
        TypeOrmModule.forFeature(entities),
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    buttonTrackingService = moduleFixture.get(ButtonTrackingService);
    await app.init();
  });

  it('/tracking/button (GET)', async () => {
    const entity = await buttonTrackingService.create(createButtonEventDto);

    return request(app.getHttpServer())
      .get('/tracking/button')
      .accept('application/json')
      .expect(200)
      .expect([{ id: 1, ...entity }]);
  });

  it('/tracking/button (POST)', () => {
    return request(app.getHttpServer())
      .post('/tracking/button')
      .send(createButtonEventDto)
      .set('Content-Type', 'application/json')
      .accept('application/json')
      .expect(201)
      .expect({ id: 1 });
  });
});
