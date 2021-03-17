import { NestFactory } from '@nestjs/core'
import { Logger } from '@nestjs/common'
import { AppModule } from './app.module'

async function bootstrap () {
  const app = await NestFactory.create(AppModule)
  if (process.env.NODE_ENV === 'local') {
    Logger.debug('Attention: Enabling CORS')
    app.enableCors()
  }
  await app.listen(3001)
}
bootstrap()
