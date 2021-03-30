import { Injectable, UnauthorizedException } from '@nestjs/common'
import * as matrixcs from 'matrix-js-sdk'

// This middleware can be applied in order to check for a valid Matrix Access Token.
// It expects two headers on the HTTP request to be set:
// - Medienhaus-Matrix-User-Id
// - Medienhaus-Matrix-Access-Token
@Injectable()
export class ValidMatrixAccessTokenMiddleware {
  async use (req, res, next) {
    // Create Matrix client
    const matrixClient = matrixcs.createClient({
      baseUrl: process.env.MATRIX_BASE_URL,
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
