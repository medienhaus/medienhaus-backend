import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as matrixcs from 'matrix-js-sdk'

// This middleware can be applied in order to check for a valid Matrix Access Token.
// It expects two headers on the HTTP request to be set:
// - Medienhaus-Matrix-User-Id
// - Medienhaus-Matrix-Access-Token
// - Medienhaus-Matrix-Server-Url (optional)
@Injectable()
export class ValidMatrixAccessTokenMiddleware {
  async use (req, res, next) {
    // By default we check the user against our base Matrix server
    let matrixServer = process.env.MATRIX_BASE_URL
    // But if the request provided a Matrix server URL we check the access token against that one, provided it's listed
    // in our whitelist of servers we allow the backend to communicate with
    if (req.headers['medienhaus-matrix-server-url'] && process.env.MATRIX_SERVER_WHITELIST.split(',').includes(req.headers['medienhaus-matrix-server-url'].substr(8))) {
      matrixServer = req.headers['medienhaus-matrix-server-url']
    }

    // Create Matrix client
    const matrixClient = matrixcs.createClient({
      baseUrl: matrixServer,
      accessToken: req.headers['medienhaus-matrix-access-token'],
      userId: req.headers['medienhaus-matrix-user-id'],
      useAuthorizationHeader: true
    })

    // Make a simple call to verify that our user ID and access token are valid, and then ...
    await matrixClient.getAccountDataFromServer().then(function () {
      // ... either forward the request, or ...
      next()
    }).catch(function (error) {
      // ... cancel it by throwing an exception.
      throw new UnauthorizedException()
    })
  }
}
