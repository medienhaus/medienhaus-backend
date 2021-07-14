import { Bind, Body, Controller, Dependencies, Post, Get } from '@nestjs/common'
import { MatrixService } from './matrix.service'

@Controller('messenger')
@Dependencies(MatrixService)
export class AppController {
  constructor (matrixService) {
    this.appService = matrixService
  }

  @Post('support')
  @Bind(Body())
  sendSupportMessage (params) {
    return this.appService.sendSupportMessage(params)
  }

  @Post('feedback')
  @Bind(Body())
  sendFeedbackMessage (params) {
    return this.appService.sendFeedbackMessage(params)
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
