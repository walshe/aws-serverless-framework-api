'use strict';

const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, UpdateCommand, DeleteCommand, ScanCommand } = require('@aws-sdk/lib-dynamodb')

const client = new DynamoDBClient({
  region: 'eu-west-1',
  maxRetries: 3,
  httpOptions: {
    timeout: 5000
  }
})
const documentClient = DynamoDBDocumentClient.from(client)

const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME


const send = (statusCode, data) => ({
  statusCode, body: JSON.stringify(data)
})

module.exports.createNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Item: {
        notesId: data.id,
        title: data.title,
        body: data.body
      },
      ConditionExpression: "attribute_not_exists(notesId)"

    }

    await documentClient.send(new PutCommand(params))

    cb(null, {
      statusCode: 201,
      body: JSON.stringify(data)
    })

  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message)
    })
  }


};

module.exports.updateNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      UpdateExpression: 'set #title = :title, #body = :body',
      ExpressionAttributeNames: {
        '#title': 'title',
        '#body': 'body'
      },
      ExpressionAttributeValues: {
        ':title': data.title,
        ':body': data.body
      },
      ConditionExpression: 'attribute_exists(notesId)',

    }

    await documentClient.send(new UpdateCommand(params))

    cb(null, {
      statusCode: 200,
      body: JSON.stringify(data)
    })

  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message)
    })
  }

};

module.exports.deleteNote = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  let notesId = event.pathParameters.id
  let data = JSON.parse(event.body);
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
      Key: { notesId },
      ConditionExpression: 'attribute_exists(notesId)',

    }

    await documentClient.send(new DeleteCommand(params))

    cb(null, {
      statusCode: 200,
      body: `Note ${notesId} has been deleted!`
    })

  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message)
    })
  }

};

module.exports.getAllNotes = async (event, context, cb) => {
  context.callbackWaitsForEmptyEventLoop = false;
  try {
    const params = {
      TableName: NOTES_TABLE_NAME,
    }

    const notes = await documentClient.send(new ScanCommand(params))
    console.log('got notes', JSON.stringify(notes))

    cb(null, {
      statusCode: 200,
      body: JSON.stringify(notes)
    })

  } catch (error) {
    cb(null, {
      statusCode: 500,
      body: JSON.stringify(error.message)
    })
  }

};

