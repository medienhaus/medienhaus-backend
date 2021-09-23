import { Controller, Dependencies, Post, Get, Bind, Headers, Body } from '@nestjs/common'
import { MatrixService } from './matrix.service'

@Controller('rundgang')
@Dependencies(MatrixService)
export class RundgangController {
  constructor (matrixService) {
    this.appService = matrixService
    this.currentTermsAndConditionsHash = '6f493bf6f3beb9d46a9c649d2f7ddd29'
  }

  // Check if the requesting user has accepted the terms and conditions
  @Get('/terms')
  @Bind(Headers('medienhaus-matrix-user-id'))
  async hasAcceptedTerms (matrixUserId) {
    const matrixClient = this.appService.createMatrixClient(process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_USERID, process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_ACCESSTOKEN)
    const search = await matrixClient.search({
      body: {
        search_categories: {
          room_events: {
            search_term: this.currentTermsAndConditionsHash,
            filter: {
              types: ['m.room.message'],
              senders: [matrixUserId]
            },
            event_context: {
              before_limit: 0,
              after_limit: 0,
              include_profile: false
            }
          }
        }
      }
    })

    return {
      hasAcceptedTerms: search.search_categories.room_events.count > 0 && search.search_categories.room_events.results.length > 0
    }
  }

  // Make the requesting user accept the terms and conditions
  @Post('/terms')
  @Bind(Headers('medienhaus-matrix-user-id'), Headers('medienhaus-matrix-access-token'), Body('termsRoomId'))
  async acceptTerms (matrixUserId, matrixUserAccessToken, termsRoomId) {
    const matrixClientBot = this.appService.createMatrixClient(process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_USERID, process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_ACCESSTOKEN)
    const matrixClientUser = this.appService.createMatrixClient(matrixUserId, matrixUserAccessToken)

    await matrixClientUser.invite(termsRoomId, matrixClientBot.getUserId()).catch(e => {
      // Ignore the error if it's just telling us that the bot is a member of this room already
      if (!e.message.includes(`${matrixClientBot.getUserId()} is already in the room`)) { throw e }
    })
    await matrixClientBot.joinRoom(termsRoomId)

    return await matrixClientUser.sendMessage(termsRoomId, {
      body: `I hereby accept the terms and conditions (${this.currentTermsAndConditionsHash})`,
      msgtype: 'm.text'
    })
  }
}
