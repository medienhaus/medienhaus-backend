import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { MatrixService } from './matrix.service'
import { ValidMatrixAccessTokenMiddleware } from './validMatrixAccessToken.middleware'
import { RundgangController } from './rundgang.controller'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController, RundgangController],
  providers: [MatrixService]
})
export class AppModule {
  configure (consumer) {
    consumer
      .apply(ValidMatrixAccessTokenMiddleware)
      .forRoutes(AppController)

    consumer.apply(ValidMatrixAccessTokenMiddleware).forRoutes({ path: '/rundgang/terms' })
  }
}
