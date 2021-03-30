import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { MatrixService } from './matrix.service'
import { ValidMatrixAccessTokenMiddleware } from './validMatrixAccessToken.middleware'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MatrixService]
})
export class AppModule {
  configure (consumer) {
    consumer
      .apply(ValidMatrixAccessTokenMiddleware)
      .forRoutes(AppController)
  }
}
