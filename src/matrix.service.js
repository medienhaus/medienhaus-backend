import { Injectable } from '@nestjs/common'
import * as matrixcs from 'matrix-js-sdk'

@Injectable()
export class MatrixService {
  createMatrixClient (userId, accessToken) {
    return matrixcs.createClient({
      baseUrl: process.env.MATRIX_BASE_URL,
      accessToken: accessToken,
      userId: userId,
      useAuthorizationHeader: true
    })
  }

  sendSupportMessage (params) {
    const matrixClient = this.createMatrixClient(process.env.SUPPORT_BOT_USERID, process.env.SUPPORT_BOT_ACCESSTOKEN)
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.displayname + '</b>  <br /> Mail address: <b>' + params.mail + '</b> <br /> Web browser: <b>' + params.browser + '</b> <br /> Operating system: <b>' + params.system + '</b><hr /> <b> ' + params.msg + '</b><br />'
    }

    return matrixClient.sendMessage(process.env.SUPPORT_CHANNEL_ROOM_ID, message)
  }

  sendFeedbackMessage (params) {
    const matrixClient = this.createMatrixClient(process.env.FEEDBACK_BOT_USERID, process.env.FEEDBACK_BOT_ACCESSTOKEN)
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'feedback message',
      formatted_body: 'From: <b>' + params.displayname + '</b>  <br /> Mail address: <b>' + params.mail + '</b><hr /> <b> ' + params.msg + '</b><br />'
    }

    return matrixClient.sendMessage(process.env.FEEDBACK_CHANNEL_ROOM_ID, message)
  }

  sendRequestRoomMessage (params) {
    const matrixClient = this.createMatrixClient(process.env.REQUEST_BOT_USERID, process.env.REQUEST_BOT_ACCESSTOKEN)
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.name + '</b><br />User ID: <b>' + params.displayname + '</b>  <br /> Email: <b>' + params.mail + '</b><br /> Department: <b>' + params.department + '</b><br /> Room name: <b>' + params.room + '</b><br />Notes: <b>' + params.notes + '</b><hr />'
    }

    return matrixClient.sendMessage(process.env.REQUEST_CHANNEL_ROOM_ID, message)
  }

  sendRequestAccMessage (params) {
    const matrixClient = this.createMatrixClient(process.env.REQUEST_BOT_USERID, process.env.REQUEST_BOT_ACCESSTOKEN)
    const message = {
      msgtype: 'm.text',
      format: 'org.matrix.custom.html',
      body: 'support message',
      formatted_body: 'From: <b>' + params.name + '</b><br />User ID: <b>' + params.displayname + '</b><br /> Email: <b>' + params.mail + '</b><br /> Department: <b>' + params.department + '</b><br />Account names: <b> ' + params.account + '</b><br />Formatted Names: <b>' + params.formattedNames + '</b>' + '</b><br />Notes: <b>' + params.notes + '</b><hr />'
    }

    return matrixClient.sendMessage(process.env.REQUEST_CHANNEL_ROOM_ID, message)
  }
}
