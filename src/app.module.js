import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { MessengerService } from './messenger.service'
import { ValidMatrixAccessTokenMiddleware } from './validMatrixAccessToken.middleware'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MessengerService]
})
export class AppModule {
  configure (consumer) {
    consumer
      .apply(ValidMatrixAccessTokenMiddleware)
      .forRoutes(AppController)
  }
}
