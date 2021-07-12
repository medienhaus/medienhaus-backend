import { Controller, Dependencies, Post, Get } from '@nestjs/common'
import { MatrixService } from './matrix.service'
import * as _ from 'lodash'
import findPathDeep from 'deepdash/findPathDeep'

const util = require('util')

@Controller('rundgang')
@Dependencies(MatrixService)
export class RundgangController {
  constructor (matrixService) {
    this.appService = matrixService
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
}
