'use strict';

const { CognitoJwtVerifier } = require("aws-jwt-verify")

const COGNITO_USER_POOL_ID = process.env.COGNITO_USER_POOL_ID
const COGNITO_WEB_CLIENT_ID = process.env.COGNITO_WEB_CLIENT_ID

const jwtVerifier = CognitoJwtVerifier.create({
  userPoolId : COGNITO_USER_POOL_ID,
  tokenUse : "id", //id token contains info about the user
  clientId : COGNITO_WEB_CLIENT_ID
})

const generatePolicy = (principalId, effect, resource) => {
  var authResponse = {};

  authResponse.principalId = principalId;
  if(effect && resource){
    let policyDocument = {
      Version : "2012-10-17",
      Statement : [{
        Effect : effect,
        Resource : resource,
        Action : "execute-api:Invoke"

      }]
    } 
    
    authResponse.policyDocument = policyDocument

  }

  authResponse.context = {
    foo : "bar"
  }

  return authResponse;
} 

module.exports.handler = async (event, context, cb) => {
  var token = event.authorizationToken;

  try {
    const payload = await jwtVerifier.verify(token)
  } catch (error) {
    cb(null , error.message)
  }

  switch(token){
    case 'allow':
      cb(null, generatePolicy("user", "Allow", event.methodArn))
      break;
    case 'deny' :   
      cb(null, generatePolicy("user", "Deny", event.methodArn))
      break;
    default:
      cb("Error: Invalid Token")    
  }


};




