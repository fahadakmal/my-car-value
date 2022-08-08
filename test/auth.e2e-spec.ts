import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('handles signup', () => {
    const email = 'fahaasasd@gmail.com';
    return request(app.getHttpServer())
      .post('/user/signUp')
      .send({ email: email, password: 'dsdaasass' })
      .expect(201)
      .then((resp) => {
        const { id, email } = resp.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });
});
