import { Controller, Dependencies, Post, Get, Bind, Headers, Body } from '@nestjs/common'
import { MatrixService } from './matrix.service'
import { filter, size } from 'lodash'

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
    const matrixClient = this.appService.createMatrixClient(
      process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_USERID,
      process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_ACCESSTOKEN,
      process.env.MATRIX_BASE_URL_CONTENT
    )

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
    const matrixClientBot = this.appService.createMatrixClient(
      process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_USERID,
      process.env.RUNDGANG_TERMS_AND_CONDITIONS_BOT_ACCESSTOKEN,
      process.env.MATRIX_BASE_URL_CONTENT
    )
    const matrixClientUser = this.appService.createMatrixClient(
      matrixUserId,
      matrixUserAccessToken,
      process.env.MATRIX_BASE_URL_CONTENT
    )

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

  // Make the requesting user knock (and possibly auto-join) on the given context space
  @Post('/knock')
  @Bind(Headers('medienhaus-matrix-user-id'), Headers('medienhaus-matrix-access-token'), Body('contextSpaceId'))
  async knockOnRoom (matrixUserId, matrixUserAccessToken, contextSpaceId) {
    const matrixClientBot = this.appService.createMatrixClient(
      process.env.RUNDGANG_BOT_USERID,
      process.env.RUNDGANG_BOT_ACCESSTOKEN,
      process.env.MATRIX_BASE_URL_CONTENT
    )
    const matrixClientUser = this.appService.createMatrixClient(
      matrixUserId,
      matrixUserAccessToken,
      process.env.MATRIX_BASE_URL_CONTENT
    )

    // User knocks on space
    await matrixClientUser.http.authedRequest(undefined, 'POST', `/knock/${contextSpaceId}`, {}, { prefix: '/_matrix/client/unstable' })

    // Check if we have more than 1 user above power level 50 (rundgang-bot will be the first, any user beyond that will be an actual "user moderator")
    const contextHasModerators = size(filter((await matrixClientBot.getStateEvent(contextSpaceId, 'm.room.power_levels')).users, (powerLevel, username) => powerLevel >= 50)) > 1

    if (contextHasModerators) {
      return { joined: false }
    }

    // If we do not have moderators for the given context space yet, we want the requesting user to be accepted automatically
    await matrixClientBot.invite(contextSpaceId, matrixClientUser.getUserId()).catch(e => {
      // Ignore the error if it's just telling us that the user is a member of this room already
      if (!e.message.includes(`${matrixClientUser.getUserId()} is already in the room`)) { throw e }
    })
    await matrixClientUser.joinRoom(contextSpaceId)

    return { joined: true }
  }
}
