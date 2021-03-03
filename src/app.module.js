import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { MessengerService } from './messenger.service'

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [AppController],
  providers: [MessengerService]
})
export class AppModule {}
