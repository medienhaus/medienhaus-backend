import { Bind, Body, Controller, Dependencies, Post } from '@nestjs/common'
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

  @Post('requestContext')
  @Bind(Body())
  sendRequestContextMessage (params) {
    return this.appService.sendRequestContextMessage(params)
  }
}
