const { auth0 } = require('../config/config')
const { auth } = require('express-oauth2-jwt-bearer');

export const ensureAuth = auth({
  audience: auth0.audience,
  issuerBaseURL: auth0.issuer,
  tokenSigningAlg: 'RS256'
  // audience: 'http://localhost:4010',
  // issuerBaseURL: 'https://dev-efues4oz5a3ih7sv.us.auth0.com/',
  // tokenSigningAlg: 'RS256'
});

// const { expressjwt: jwt} = require('express-jwt')
// const jwksRsa = require('jwks-rsa')

// export const ensureAuth = jwt({
//   secret: jwksRsa.expressJwtSecret({
//     cache: true,
//     rateLimit: true,
//     jwksRequestsPerMinute: 5,
//     jwksUri: `${auth0.issuer}.well-known/jwks.json`
//   }),

//   audience: auth0.audience,
//   issuer: auth0.issuer,
//   algorithms: ['RS256']
// })