# Serverless Secured CRUD API

Example of API Gateway, Cognito, Cognito Api Gateway, Authorizor, Cognito PreSignUp Trigger, Lambdas, DynamoDB

## Requirements

Serverless Framework 3 installed globally

Appropriate AWS Access Key + secret configured



## Sign in to Cognito domain (to get id token )

https://<cognito domain>/login?response_type=token&client_id=<cognito client id>&redirect_uri=<callback url>


## Endpoints

curl -X POST https://<api gw id>.execute-api.eu-west-1.amazonaws.com/<stage>/notes -H 'Authorization: Bearer <id token>' -d '{"id": "7","title":"some title", "body" : "somebodyadasdasd"  }'

curl -X PUT https://<api gw id>.execute-api.eu-west-1.amazonaws.com/<stage>/notes/7 -H 'Authorization: Bearer <id token>' -d '{"title":"updated title", "body" : "updated body"  }'

curl -X DELETE https://<api gw id>.execute-api.eu-west-1.amazonaws.com/<stage>/notes/7 -H 'Authorization: Bearer <id token>'

curl -X GET https://<api gw id>.execute-api.eu-west-1.amazonaws.com/<stage>/notes -H 'Authorization: Bearer <id token>'