import { Test } from '@nestjs/testing'
import { AppController } from './app.controller'
import { MessengerService } from './messenger.service'

describe('AppController', () => {
  let app

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [MessengerService]
    }).compile()
  })

  // describe('getHello', () => {
  //   it('should return "Hello World!"', () => {
  //     const appController = app.get(AppController);
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
})
