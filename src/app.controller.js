import { Bind, Body, Controller, Dependencies, Get, Param, Post } from '@nestjs/common'
import { MessengerService } from './messenger.service'

@Controller('messenger')
@Dependencies(MessengerService)
export class AppController {
  constructor (appService) {
    this.appService = appService
  }

  @Post('support')
  @Bind(Body())
  sendSupportMessage (params) {
    return this.appService.sendSupportMessage(params)
  }
}
