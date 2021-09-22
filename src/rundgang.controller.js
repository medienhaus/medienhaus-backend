import { Controller, Dependencies, Post, Get, Bind, Param, Headers, Body } from '@nestjs/common'
import { MatrixService } from './matrix.service'
import * as _ from 'lodash'
import findPathDeep from 'deepdash/findPathDeep'

@Controller('rundgang')
@Dependencies(MatrixService)
export class RundgangController {
  constructor (matrixService) {
    this.appService = matrixService
    this.currentTermsAndConditionsHash = '6f493bf6f3beb9d46a9c649d2f7ddd29'
  }

  @Get('/')
  async helloWorld () {
    const matrixClient2 = this.appService.createMatrixClient(process.env.SUPPORT_BOT_USERID, process.env.SUPPORT_BOT_ACCESSTOKEN)
    // UdK Space
    const motherSpaceRoomId = '!TkxjgOEaSzwJnTtNMy:dev.medienhaus.udk-berlin.de'

    matrixClient2.on('event', (eventData) => {
      // console.log(eventData)
    })
    matrixClient2.on('Room.timeline', (eventData) => {
      // console.log('Room.timeline')
      // console.log(eventData)
    })
    await matrixClient2.startClient()

    function createSpaceObject (id, spaceSummary) {
      return {
        id: id,
        name: _.get(_.find(spaceSummary.rooms, ['room_id', id]), 'name'),
        children: {}
      }
    }

    const result = {}

    async function scanForAndAddSpaceChildren (spaceId, initial) {
      console.log('getting children for ' + spaceId)
      const spaceSummary = await matrixClient2.getSpaceSummary(spaceId)

      if (initial) {
        _.set(result, [spaceId], createSpaceObject(spaceId, spaceSummary))
      }

      for (const event of spaceSummary.events) {
        if (event.type !== 'm.space.child') continue
        if (event.room_id !== spaceId) continue
        if (event.sender !== '@robert9:dev.medienhaus.udk-berlin.de') continue

        // find deep where 'id' === event.room_id, and assign match to 'children'
        const path = findPathDeep(result, (room, key) => {
          return key === event.room_id
        }, {
          includeRoot: true,
          rootIsChildren: true,
          pathFormat: 'array',
          childrenPath: 'children'
        })

        if (!path) continue

        const childrenSpaceToAdd = createSpaceObject(event.state_key, spaceSummary)
        if (!childrenSpaceToAdd.name) continue

        _.set(result, [...path, 'children', event.state_key], childrenSpaceToAdd)

        // Check if this is a space itself, and if so try to get its children
        if (_.get(_.find(spaceSummary.rooms, ['room_id', event.state_key]), 'room_type') === 'm.space') {
          await scanForAndAddSpaceChildren(event.state_key, false)
        }
      }
    }

    await scanForAndAddSpaceChildren(motherSpaceRoomId, true)

    return result
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
