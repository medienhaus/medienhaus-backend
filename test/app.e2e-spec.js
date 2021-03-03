import request from 'supertest';
import { Test } from '@nestjs/testing';
import { AppController } from '../src/app.controller';
import { MessengerService } from '../src/messenger.service';

describe('AppController (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      controllers: [AppController],
      providers: [MessengerService],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/GET /', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
