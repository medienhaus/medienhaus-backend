import { Injectable } from '@nestjs/common'
import * as matrixcs from 'matrix-js-sdk'

@Injectable()
export class MessengerService {
  sendSupportMessage (params) {
    const matrixClient = matrixcs.createClient({
      baseUrl: process.env.MATRIX_BASE_URL,
      accessToken: process.env.SUPPORT_BOT_ACCESSTOKEN,
      userId: process.env.SUPPORT_BOT_USERID,
      useAuthorizationHeader: true
    })
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.displayname + '</b>  <br /> Mail address: <b>' + params.mail + '</b> <br /> Web browser: <b>' + params.browser + '</b> <br /> Operating system: <b>' + params.system + '</b><hr /> <b> ' + params.msg + '</b><br />'
    }

    // @TODO: Auth
    return matrixClient.sendMessage(process.env.SUPPORT_CHANNEL_ROOM_ID, message)
  }

  sendRequestRoomMessage (params) {
    const matrixClient = matrixcs.createClient({
      baseUrl: process.env.MATRIX_BASE_URL,
      accessToken: process.env.REQUEST_BOT_ACCESSTOKEN,
      userId: process.env.REQUEST_BOT_USERID,
      useAuthorizationHeader: true
    })
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.name + '</b><br />User ID: <b>' + params.displayname + '</b>  <br /> Email: <b>' + params.mail + '</b><br /> Department: <b>' + params.department + '</b><br /> Room name: <b>' + params.room + '</b><br />Notes: <b>' + params.notes + '</b><hr />'
    }

    // @TODO: Auth
    return matrixClient.sendMessage(process.env.REQUEST_CHANNEL_ROOM_ID, message)
  }

  sendRequestAccMessage (params) {
    const matrixClient = matrixcs.createClient({
      baseUrl: process.env.MATRIX_BASE_URL,
      accessToken: process.env.REQUEST_BOT_ACCESSTOKEN,
      userId: process.env.REQUEST_BOT_USERID,
      useAuthorizationHeader: true
    })
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.name + '</b><br />User ID: <b>' + params.displayname + '</b><br /> Email: <b>' + params.mail + '</b><br /> Department: <b>' + params.department + '</b><br />Account names: <b> ' + params.account + '</b><br />Formatted Names: <b>' + params.formattedNames + '</b>'+ '</b><br />Notes: <b>' + params.notes + '</b><hr />'
   }

    // @TODO: Auth
    return matrixClient.sendMessage(process.env.REQUEST_CHANNEL_ROOM_ID, message)
  }
}
