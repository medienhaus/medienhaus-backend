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

  @Post('requestRoom')
  @Bind(Body())
  sendRequestRoomMessage (params) {
    return this.appService.sendRequestRoomMessage(params)
  }

  @Post('requestAcc')
  @Bind(Body())
  sendRequestAccMessage (params) {
    return this.appService.sendRequestAccMessage(params)
  }
}
